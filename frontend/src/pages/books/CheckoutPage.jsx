import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from "react-hook-form"
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { clearCart } from '../../redux/features/cart/cartSlice';
import Swal from 'sweetalert2';
import {
    useCreateOrderMutation,
    useCreateRazorpayOrderMutation,
    useVerifyPaymentMutation
} from '../../redux/features/orders/ordersApi';
import { FiShoppingBag, FiTruck, FiCreditCard, FiCheckCircle, FiMapPin } from 'react-icons/fi';
import { MdOutlinePayment } from 'react-icons/md';
import { FaRupeeSign } from 'react-icons/fa';

const CheckoutPage = () => {
    const cartItems = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const totalPrice = cartItems.reduce((acc, item) => acc + item.newPrice, 0).toFixed(2);
    const totalPriceINR = (totalPrice * 83).toFixed(2); // Convert $ to ₹ approx

    const { register, handleSubmit, getValues, formState: { errors } } = useForm();
    const [isChecked, setIsChecked] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'Online'
    const [isProcessing, setIsProcessing] = useState(false);

    const [createOrder] = useCreateOrderMutation();
    const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
    const [verifyPayment] = useVerifyPaymentMutation();

    const buildOrderData = (data) => ({
        name: data.name,
        email: currentUser?.email,
        address: {
            street: data.address,
            city: data.city,
            country: data.country,
            state: data.state,
            zipcode: data.zipcode,
        },
        phone: data.phone,
        productIds: cartItems.map(item => item?._id),
        totalPrice: Number(totalPriceINR),
    });

    // ── Cash on Delivery Flow ──────────────────────────────────────────
    const handleCODOrder = async (data) => {
        try {
            setIsProcessing(true);
            const orderData = { ...buildOrderData(data), paymentMethod: 'COD', paymentStatus: 'Pending' };
            await createOrder(orderData).unwrap();
            dispatch(clearCart());
            Swal.fire({
                title: '✅ Order Placed!',
                text: 'Your Cash on Delivery order has been confirmed.',
                icon: 'success',
                confirmButtonColor: '#0284c7',
                confirmButtonText: 'View My Orders',
                background: '#0f172a',
                color: '#fff',
            }).then(() => navigate('/orders'));
        } catch (err) {
            console.error(err);
            Swal.fire({ title: 'Error', text: 'Failed to place order.', icon: 'error' });
        } finally {
            setIsProcessing(false);
        }
    };

    // ── Razorpay Online Payment Flow ───────────────────────────────────
    const handleOnlinePayment = async (data) => {
        try {
            setIsProcessing(true);

            // Step 1: Create Razorpay Order on backend
            const { orderId, amount, currency, keyId } = await createRazorpayOrder({
                amount: Number(totalPriceINR),
            }).unwrap();

            // Step 2: Load Razorpay checkout script dynamically
            const loadScript = (src) =>
                new Promise((resolve) => {
                    if (document.querySelector(`script[src="${src}"]`)) {
                        resolve(true);
                        return;
                    }
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = () => resolve(true);
                    script.onerror = () => resolve(false);
                    document.body.appendChild(script);
                });

            const loaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
            if (!loaded) {
                throw new Error('Razorpay SDK failed to load. Check your internet connection.');
            }

            // Step 3: Open Razorpay Popup
            const options = {
                key: keyId,
                amount,
                currency,
                name: 'Litsense Bookstore',
                description: `Purchase of ${cartItems.length} book(s)`,
                order_id: orderId,
                prefill: {
                    name: data.name,
                    email: currentUser?.email,
                    contact: data.phone,
                },
                theme: { color: '#38bdf8' },
                handler: async (response) => {
                    try {
                        // Step 4: Send payment details to backend for verification
                        const orderData = buildOrderData(data);
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderData,
                        }).unwrap();

                        dispatch(clearCart());
                        Swal.fire({
                            title: '🎉 Payment Successful!',
                            html: `<p class="text-gray-300 text-sm">Payment ID: <b class="text-sky-400">${response.razorpay_payment_id}</b></p>`,
                            icon: 'success',
                            confirmButtonColor: '#0284c7',
                            confirmButtonText: 'View My Orders',
                            background: '#0f172a',
                            color: '#fff',
                        }).then(() => navigate('/orders'));
                    } catch (err) {
                        Swal.fire({ title: 'Verification Failed', text: 'Payment received but verification failed. Contact support.', icon: 'error' });
                    }
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                        Swal.fire({ title: 'Payment Cancelled', text: 'You closed the payment window.', icon: 'info', background: '#0f172a', color: '#fff' });
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error(err);
            Swal.fire({ title: 'Payment Error', text: err.message || 'Could not initiate payment.', icon: 'error' });
            setIsProcessing(false);
        }
    };

    const onSubmit = (data) => {
        if (paymentMethod === 'COD') {
            handleCODOrder(data);
        } else {
            handleOnlinePayment(data);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-white">
                <p className="text-5xl">🛒</p>
                <h2 className="text-2xl font-bold">Your cart is empty</h2>
                <Link to="/" className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-xl font-semibold transition-colors">
                    Browse Books
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-10 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
                        <FiShoppingBag className="text-sky-400" />
                        Checkout
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">{cartItems.length} item(s) in your cart</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* ── LEFT: Form ─────────────────────────────────────── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Shipping Details Card */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                                <FiMapPin className="text-sky-400" /> Shipping Details
                            </h2>
                            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1 block">Full Name *</label>
                                        <input
                                            {...register("name", { required: "Name is required" })}
                                            placeholder="John Doe"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                                        />
                                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                                    </div>
                                    <div>
                                        <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1 block">Phone *</label>
                                        <input
                                            {...register("phone", { required: "Phone is required" })}
                                            placeholder="+91 98765 43210"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                                        />
                                        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1 block">Email</label>
                                    <input
                                        type="text"
                                        disabled
                                        defaultValue={currentUser?.email}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-gray-500 text-sm cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1 block">Street Address *</label>
                                    <input
                                        {...register("address", { required: "Address is required" })}
                                        placeholder="123 Bookworm Lane"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                                    />
                                    {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
                                </div>

                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1 block">City *</label>
                                        <input
                                            {...register("city", { required: true })}
                                            placeholder="Mumbai"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1 block">State</label>
                                        <input
                                            {...register("state")}
                                            placeholder="Maharashtra"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1 block">Pincode</label>
                                        <input
                                            {...register("zipcode")}
                                            placeholder="400001"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1 block">Country</label>
                                    <input
                                        {...register("country")}
                                        placeholder="India"
                                        defaultValue="India"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Payment Method Selector */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                                <MdOutlinePayment className="text-sky-400 text-xl" /> Payment Method
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {/* Cash on Delivery */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('COD')}
                                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer
                                        ${paymentMethod === 'COD'
                                            ? 'border-sky-500 bg-sky-500/10 shadow-[0_0_20px_rgba(56,189,248,0.15)]'
                                            : 'border-white/10 bg-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <FiTruck className={`text-xl ${paymentMethod === 'COD' ? 'text-sky-400' : 'text-gray-400'}`} />
                                        <span className={`font-bold text-sm ${paymentMethod === 'COD' ? 'text-white' : 'text-gray-400'}`}>Cash on Delivery</span>
                                        {paymentMethod === 'COD' && <FiCheckCircle className="ml-auto text-sky-400" />}
                                    </div>
                                    <p className="text-gray-500 text-xs leading-relaxed">Pay when your books arrive at your doorstep. No advance payment needed.</p>
                                </button>

                                {/* Online Payment */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('Online')}
                                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer
                                        ${paymentMethod === 'Online'
                                            ? 'border-sky-500 bg-sky-500/10 shadow-[0_0_20px_rgba(56,189,248,0.15)]'
                                            : 'border-white/10 bg-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <FiCreditCard className={`text-xl ${paymentMethod === 'Online' ? 'text-sky-400' : 'text-gray-400'}`} />
                                        <span className={`font-bold text-sm ${paymentMethod === 'Online' ? 'text-white' : 'text-gray-400'}`}>Pay Online</span>
                                        {paymentMethod === 'Online' && <FiCheckCircle className="ml-auto text-sky-400" />}
                                    </div>
                                    <p className="text-gray-500 text-xs leading-relaxed">UPI, Cards, Netbanking & Wallets — Secured by Razorpay.</p>
                                    <div className="flex gap-1.5 mt-2">
                                        {['UPI', 'Visa', 'MC', 'NB'].map(m => (
                                            <span key={m} className="text-[9px] font-bold px-1.5 py-0.5 bg-white/10 text-gray-300 rounded">{m}</span>
                                        ))}
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Terms */}
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                onChange={(e) => setIsChecked(e.target.checked)}
                                className="mt-1 accent-sky-500 h-4 w-4 cursor-pointer"
                            />
                            <span className="text-gray-500 text-sm group-hover:text-gray-400 transition-colors">
                                I agree to the{' '}
                                <Link to="#" className="text-sky-400 hover:underline">Terms & Conditions</Link>
                                {' '}and{' '}
                                <Link to="#" className="text-sky-400 hover:underline">Shopping Policy</Link>.
                            </span>
                        </label>
                    </div>

                    {/* ── RIGHT: Order Summary ────────────────────────────── */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
                            <h2 className="text-white font-bold text-lg mb-5">Order Summary</h2>

                            {/* Items */}
                            <div className="space-y-3 mb-5 max-h-60 overflow-y-auto pr-1">
                                {cartItems.map((item) => {
                                    const cover = item.coverImage || item.img;
                                    return (
                                        <div key={item._id} className="flex gap-3 items-center">
                                            {cover && (
                                                <img src={cover} alt={item.title}
                                                    className="w-10 h-14 object-cover rounded-lg flex-shrink-0 border border-white/10" />
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="text-white text-xs font-semibold truncate">{item.title}</p>
                                                <p className="text-gray-500 text-xs truncate">by {item.author}</p>
                                            </div>
                                            <span className="text-green-400 text-xs font-bold flex-shrink-0">
                                                ₹{(item.newPrice * 83).toFixed(0)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-white/10 pt-4 space-y-2 mb-6">
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span>₹{totalPriceINR}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Delivery</span>
                                    <span className="text-green-400">FREE</span>
                                </div>
                                <div className="flex justify-between text-white font-extrabold text-lg pt-2 border-t border-white/10">
                                    <span>Total</span>
                                    <span className="flex items-center gap-1">
                                        <FaRupeeSign className="text-base" />{totalPriceINR}
                                    </span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={!isChecked || isProcessing}
                                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95
                                    ${isChecked && !isProcessing
                                        ? paymentMethod === 'Online'
                                            ? 'bg-sky-500 hover:bg-sky-400 text-white shadow-[0_0_20px_rgba(56,189,248,0.3)] cursor-pointer'
                                            : 'bg-amber-500 hover:bg-amber-400 text-black cursor-pointer'
                                        : 'bg-white/10 text-gray-600 cursor-not-allowed'
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Processing...
                                    </>
                                ) : paymentMethod === 'Online' ? (
                                    <>
                                        <FiCreditCard className="text-lg" />
                                        Pay ₹{totalPriceINR} Online
                                    </>
                                ) : (
                                    <>
                                        <FiTruck className="text-lg" />
                                        Place COD Order
                                    </>
                                )}
                            </button>

                            <p className="text-center text-gray-600 text-xs mt-3 flex items-center justify-center gap-1">
                                🔒 Secured by Razorpay & 256-bit SSL
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;