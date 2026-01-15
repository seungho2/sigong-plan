import React, { useState, useEffect } from 'react';
import { uploadImage, deleteImage } from '../utils/cloudinary';
import { auth, db } from '../utils/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword } from "firebase/auth";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, getDoc, setDoc } from "firebase/firestore";

const Admin = () => {
    // Login State
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [rememberEmail, setRememberEmail] = useState(false);

    // Gallery Data State
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Upload State
    const [uploading, setUploading] = useState(false);
    const [filesCount, setFilesCount] = useState(0);

    const [uploadError, setUploadError] = useState(null);

    // API Secret State
    const [apiSecret, setApiSecret] = useState(null);

    // Multi-select State
    const [selectedItems, setSelectedItems] = useState(new Set());

    // Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // Fetch API Secret from Config (or bootstrap it)
    useEffect(() => {
        if (!user) return;

        const fetchSecret = async () => {
            try {
                const configRef = doc(db, "config", "cloudinary");
                const configSnap = await getDoc(configRef);

                if (configSnap.exists()) {
                    setApiSecret(configSnap.data().secret);
                } else {
                    // Bootstrap: Save the secret to DB for the first time
                    // (In a real scenario, this would be done manually in Firebase Console)
                    const initialSecret = "fFSPmVvU_mQVonQYf6X49MLqXYw";
                    await setDoc(configRef, { secret: initialSecret });
                    setApiSecret(initialSecret);
                    console.log("Secret bootstrapped to DB");
                }
            } catch (err) {
                console.error("Failed to fetch API secret:", err);
            }
        };

        fetchSecret();
    }, [user]);

    // Fetch Gallery Items (Real-time)
    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, "gallery"), orderBy("date", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() });
            });
            setGalleryItems(items);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    // Check for saved email on mount
    useEffect(() => {
        const savedEmail = localStorage.getItem('adminEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberEmail(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setLoginError("");

            // Handle Remember Email
            if (rememberEmail) {
                localStorage.setItem('adminEmail', email);
            } else {
                localStorage.removeItem('adminEmail');
            }
        } catch (error) {
            console.error(error);
            setLoginError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Reset all states to ensure clean slate on re-login
            setEmail("");
            setPassword("");
            setIsPasswordModalOpen(false);
            setIsChangeSuccess(false);
            setPasswordMessage({ type: "", text: "" });
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        setFilesCount(files.length);
        setUploadError(null);

        try {
            // Process all files concurrently
            const uploadPromises = files.map(async (file) => {
                // 1. Upload to Cloudinary
                const result = await uploadImage(file);

                // 2. Save to Firebase Firestore
                await addDoc(collection(db, "gallery"), {
                    url: result.secure_url,
                    publicId: result.public_id,
                    category: "all",
                    isVisible: true,
                    date: new Date().toISOString(),
                    title: file.name
                });
                return result;
            });

            await Promise.all(uploadPromises);
            console.log("All files uploaded successfully");

        } catch (err) {
            console.error(err);
            setUploadError("Some uploads failed: " + err.message);
        } finally {
            setUploading(false);
            e.target.value = null; // Reset input
        }
    };

    const toggleVisibility = async (id, currentStatus) => {
        const itemRef = doc(db, "gallery", id);
        await updateDoc(itemRef, {
            isVisible: !currentStatus
        });
    };

    // Password Change State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
    const [isChangeSuccess, setIsChangeSuccess] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: "", text: "" });

        if (newPassword.length < 6) {
            setPasswordMessage({ type: "error", text: "비밀번호는 6자 이상이어야 합니다." });
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: "error", text: "비밀번호가 일치하지 않습니다." });
            return;
        }

        try {
            await updatePassword(user, newPassword);
            setPasswordMessage({ type: "success", text: "비밀번호가 성공적으로 변경되었습니다." });
            setIsChangeSuccess(true);
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/requires-recent-login') {
                setPasswordMessage({ type: "error", text: "보안을 위해 다시 로그인한 후 시도해주세요." });
            } else {
                setPasswordMessage({ type: "error", text: "비밀번호 변경 실패: " + error.message });
            }
        }
    };

    const handleDelete = async (item) => {
        if (window.confirm("정말로 이 사진을 갤러리에서 삭제하시겠습니까? (삭제 후 복구 불가능)")) {
            try {
                // 1. Delete from Cloudinary
                if (item.publicId && apiSecret) {
                    await deleteImage(item.publicId, apiSecret);
                } else if (item.publicId && !apiSecret) {
                    console.warn("API Secret not loaded, skipping Cloudinary deletion");
                    alert("경고: API 키가 로드되지 않아 클라우드 이미지는 삭제되지 않았을 수 있습니다.");
                }

                // 2. Delete from Firestore
                await deleteDoc(doc(db, "gallery", item.id));

                // Remove from selection if it was selected
                const newSelected = new Set(selectedItems);
                newSelected.delete(item.id);
                setSelectedItems(newSelected);

                alert("삭제되었습니다.");
            } catch (error) {
                console.error("Delete failed:", error);
                alert("삭제 실패: " + error.message);
            }
        }
    };

    // Multi-select Handlers
    const toggleSelection = (id) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = new Set(galleryItems.map(item => item.id));
            setSelectedItems(allIds);
        } else {
            setSelectedItems(new Set());
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`선택한 ${selectedItems.size}개의 사진을 정말 삭제하시겠습니까? (복구 불가)`)) return;

        let successCount = 0;
        let failCount = 0;

        for (const id of selectedItems) {
            const item = galleryItems.find(i => i.id === id);
            if (!item) continue;

            try {
                if (item.publicId && apiSecret) {
                    await deleteImage(item.publicId, apiSecret);
                }
                await deleteDoc(doc(db, "gallery", id));
                successCount++;
            } catch (error) {
                console.error(`Failed to delete ${id}:`, error);
                failCount++;
            }
        }

        setSelectedItems(new Set());
        alert(`삭제 완료: 성공 ${successCount}건, 실패 ${failCount}건`);
    };

    const handleBulkToggle = async (targetStatus) => {
        if (!window.confirm(`선택한 ${selectedItems.size}개의 사진을 ${targetStatus ? '노출' : '숨김'} 처리하시겠습니까?`)) return;

        let count = 0;
        for (const id of selectedItems) {
            try {
                const itemRef = doc(db, "gallery", id);
                await updateDoc(itemRef, { isVisible: targetStatus });
                count++;
            } catch (error) {
                console.error(`Failed to update ${id}:`, error);
            }
        }
        setSelectedItems(new Set());
        alert(`${count}개의 사진 상태가 변경되었습니다.`);
    };

    // 1. Login Screen
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Admin Login
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Enter your credentials to access the dashboard
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">Email address</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>


                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-[var(--color-secondary)] focus:ring-[var(--color-secondary)] border-gray-300 rounded"
                                    checked={rememberEmail}
                                    onChange={(e) => setRememberEmail(e.target.checked)}
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    이메일 저장
                                </label>
                            </div>
                        </div>

                        {loginError && <div className="text-red-500 text-sm text-center">{loginError}</div>}

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--color-text)] hover:bg-[var(--color-secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary)] transition-colors"
                            >
                                Sign in
                            </button>
                        </div>
                    </form >
                </div >
            </div >
        );
    }

    // 2. Dashboard
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold text-gray-900">Gallery Manager</h1>
                            <button
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="group flex items-center gap-1.5 px-4 py-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md"
                            >
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                비밀번호 변경
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Logged in as {user.email}</p>
                    </div>
                    <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                        Logout
                    </button>
                </div>

                {/* Upload Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Photo</h2>
                    <div className="flex items-center space-x-4">
                        <label className="relative cursor-pointer bg-[var(--color-secondary)] hover:bg-[#A08055] text-white py-2 px-4 rounded-md transition-colors shadow-sm">
                            <span>{uploading ? `Uploading ${filesCount > 0 ? filesCount + ' files...' : '...'}` : "Select Files"}</span>
                            <input type="file" className="hidden" accept="image/*" multiple onChange={handleUpload} disabled={uploading} />
                        </label>
                        {uploading && <span className="text-sm text-gray-500 animate-pulse">Processing...</span>}
                        {uploadError && <span className="text-sm text-red-500">{uploadError}</span>}
                    </div>
                </div>

                {/* Gallery List */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-20">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                className="w-5 h-5 rounded border-gray-300 text-[var(--color-secondary)] focus:ring-[var(--color-secondary)]"
                                checked={galleryItems.length > 0 && selectedItems.size === galleryItems.length}
                                onChange={handleSelectAll}
                                disabled={galleryItems.length === 0}
                            />
                            <h2 className="text-lg font-medium text-gray-900">Current Photos ({galleryItems.length})</h2>
                        </div>
                        {selectedItems.size > 0 && (
                            <span className="text-sm font-semibold text-[var(--color-secondary)] bg-orange-50 px-3 py-1 rounded-full">
                                {selectedItems.size}개 선택됨
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading gallery data...</div>
                    ) : galleryItems.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No photos yet. Upload one!</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                            {galleryItems.map((item) => (
                                <div key={item.id} className={`relative group bg-gray-50 rounded-lg border transition-all duration-200 ${selectedItems.has(item.id) ? 'ring-2 ring-[var(--color-secondary)] border-transparent bg-orange-50' : (!item.isVisible ? 'opacity-60 grayscale' : 'border-gray-200')}`}>

                                    {/* Selection Checkbox (Overlay) */}
                                    <div className="absolute top-3 left-3 z-10">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-gray-300 text-[var(--color-secondary)] focus:ring-[var(--color-secondary)] shadow-sm"
                                            checked={selectedItems.has(item.id)}
                                            onChange={() => toggleSelection(item.id)}
                                        />
                                    </div>

                                    <div className="aspect-w-16 aspect-h-12 overflow-hidden rounded-t-lg bg-gray-200 cursor-pointer" onClick={() => toggleSelection(item.id)}>
                                        <img src={item.url} alt={item.title} className="object-cover w-full h-48" />
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.isVisible ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                {item.isVisible ? '● 노출중' : '○ 숨김'}
                                            </span>
                                            <span className="text-xs text-gray-400 font-mono">{new Date(item.date).toLocaleDateString()}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-100">
                                            <button
                                                onClick={() => toggleVisibility(item.id, item.isVisible)}
                                                className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm ${item.isVisible
                                                    ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 border border-transparent'
                                                    }`}
                                            >
                                                {item.isVisible ? '숨기기' : '노출하기'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item)}
                                                className="px-3 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-colors"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Password Change Modal */}
                {isPasswordModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-scale-in">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-900">비밀번호 변경</h3>
                                <button
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>

                            <div className="p-6">
                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">새 비밀번호</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all disabled:opacity-50 disabled:bg-gray-100"
                                            placeholder="6자 이상 입력해주세요"
                                            required
                                            disabled={isChangeSuccess}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">새 비밀번호 확인</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all disabled:opacity-50 disabled:bg-gray-100"
                                            placeholder="한 번 더 입력해주세요"
                                            required
                                            disabled={isChangeSuccess}
                                        />
                                    </div>

                                    {passwordMessage.text && (
                                        <div className={`p-3 rounded-lg text-sm font-medium ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                            {passwordMessage.text}
                                        </div>
                                    )}

                                    <div className="pt-2">
                                        {!isChangeSuccess ? (
                                            <button
                                                type="submit"
                                                className="w-full px-4 py-3 bg-[var(--color-secondary)] hover:bg-[#A08055] text-white font-bold rounded-xl shadow-lg shadow-orange-900/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary)] transition-all active:scale-[0.98]"
                                            >
                                                변경하기
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="w-full px-4 py-3 bg-[var(--color-secondary)] hover:bg-[#A08055] text-white font-bold rounded-xl shadow-lg shadow-orange-900/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary)] transition-all active:scale-[0.98]"
                                            >
                                                확인 (로그아웃)
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
                {/* Floating Bulk Action Bar */}
                {selectedItems.size > 0 && (
                    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white rounded-full shadow-2xl border border-gray-700 px-6 py-3 z-40 flex items-center gap-4 animate-fade-in-up">
                        <span className="text-sm font-bold text-white border-r border-gray-700 pr-4 mr-1">
                            {selectedItems.size}개 선택됨
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleBulkToggle(true)}
                                className="px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
                            >
                                다중 노출
                            </button>
                            <button
                                onClick={() => handleBulkToggle(false)}
                                className="px-3 py-1.5 text-sm font-medium text-white bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                            >
                                다중 숨김
                            </button>
                            <div className="w-px h-4 bg-gray-600 mx-1"></div>
                            <button
                                onClick={handleBulkDelete}
                                className="px-3 py-1.5 text-sm font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                삭제하기
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
