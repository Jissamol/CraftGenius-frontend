import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Api from '../services/Api';
import { CheckCircle2, Loader2, XCircle, ArrowRight, Package } from 'lucide-react';
import { motion } from 'framer-motion';

function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [status, setStatus] = useState('loading'); // loading, success, pending, error
    const [orders, setOrders] = useState([]);
    const [countdown, setCountdown] = useState(3);
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionId) {
            const checkStatus = () => {
                Api.get(`stripe/payment-success/?session_id=${sessionId}`)
                    .then(res => {
                        if (res.data.status === 'success') {
                            setStatus('success');
                            setOrders(res.data.orders || []);

                            // Start countdown for redirect
                            let timer = 3;
                            setCountdown(timer);
                            const interval = setInterval(() => {
                                timer -= 1;
                                setCountdown(timer);
                                if (timer <= 0) {
                                    clearInterval(interval);
                                    navigate('/customer/orders');
                                }
                            }, 1000);
                        } else if (res.data.status === 'pending') {
                            setStatus('pending');
                            setTimeout(checkStatus, 3000);
                        }
                    })
                    .catch(() => setStatus('error'));
            };
            checkStatus();
        } else {
            setStatus('error');
        }
    }, [sessionId, navigate]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 text-center">
                
                {status === 'loading' || status === 'pending' ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                            <Loader2 size={32} className="text-indigo-600 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {status === 'loading' ? 'Verifying payment...' : 'Almost there...'}
                        </h2>
                        <p className="text-gray-500 text-sm">Placing your order. Please don't close this window.</p>
                    </motion.div>
                ) : status === 'success' ? (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-50/50">
                            <CheckCircle2 size={40} className="text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                        <p className="text-gray-500 text-sm mb-6">Thank you for your purchase. Your order has been confirmed.</p>
                        
                        <div className="w-full bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100 text-left">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Order Items</h3>
                            <div className="space-y-3">
                                {orders.map(o => (
                                    <div key={o.id} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500 flex-shrink-0">
                                            <Package size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{o.product}</p>
                                            <p className="text-xs text-gray-400 font-mono">Order #{String(o.id).padStart(5, '0')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p className="text-sm font-medium text-indigo-600 mb-6">
                            Redirecting to your orders in {countdown}s...
                        </p>
                        
                        <button 
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                            onClick={() => navigate('/customer/orders')}
                        >
                            View My Orders Now <ArrowRight size={16} />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-50/50">
                            <XCircle size={40} className="text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                        <p className="text-gray-500 text-sm mb-8">We couldn't verify your payment. If you were charged, please contact support.</p>
                        <button 
                            className="w-full py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                            onClick={() => navigate('/customer/marketplace')}
                        >
                            Back to Market
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default PaymentSuccess;
