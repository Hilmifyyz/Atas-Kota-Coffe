import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            // Check if it's the admin email
            if (formData.email !== 'admin@ataskota.com') {
                setErrors({ email: 'Invalid admin credentials' });
                return;
            }

            const userCredential = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // Check admin status in Firestore
            const userDoc = await getDoc(doc(db, 'admins', userCredential.user.uid));
            
            if (userDoc.exists() && userDoc.data().admin === true) {
                // Redirect to admin dashboard
                navigate('/admin/product');
            } else {
                setErrors({ email: 'Unauthorized access' });
                await auth.signOut();
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors({
                email: 'Invalid credentials',
                password: 'Invalid credentials'
            });
        }
    };

    return (
        <div className="flex items-center justify-center pt-24 top-0 left-0 right-0 bg-[#FFFBF2]">
            <div className="w-full mx-auto max-w-md  rounded-[20px] bg-[#FFF2D6]">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-Logo w-64 h-32 bg-contain bg-no-repeat bg-center"></div>
                    <p className="text-gray-600 text-center">
                        Welcome to Admin Panel<br />
                        Atas Kota Coffee
                    </p>
                </div>
                <div className="bg-[#D9BB7A] rounded-t-[60px] rounded-b-[20px] p-8">
                <h2 className="text-2xl font-sans pb-8 font-[700]">Admin Login</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-left font-sans font-[600] text-sm mb-2">Email address</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-lg bg-white ${errors.email ? 'border-red-500' : ''}`}
                            placeholder="Enter admin email"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-left font-sans font-[600] text-sm mb-2">Password</label>
                        <input 
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-lg bg-white ${errors.password ? 'border-red-500' : ''}`}
                            placeholder="Enter admin password"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input 
                                type="checkbox"
                                name="remember"
                                checked={formData.remember}
                                onChange={handleChange}
                                id="remember" 
                                className="mr-2"
                            />
                            <label htmlFor="remember" className="font-sans font-[600] text-sm">Remember me</label>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-[#E8C98B] py-3 rounded-lg font-sans font-[500] text-black hover:bg-[#d4b87c] transition-colors"
                    >
                        Sign In
                    </button>
                </form>
                </div>
            </div>
        </div>
    );
};

export default Login;