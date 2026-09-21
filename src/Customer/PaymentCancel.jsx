import { useNavigate } from 'react-router-dom';
import { AlertCircle, ShoppingCart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

function PaymentCancel() {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 text-center"
            >
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-amber-50/50">
                        <AlertCircle size={40} className="text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
                    <p className="text-gray-500 text-sm mb-8">
                        Your transaction was cancelled and you haven't been charged. You can safely return to your cart and try again.
                    </p>
                    
                    <div className="w-full space-y-3">
                        <button 
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                            onClick={() => navigate('/customer/cart')}
                        >
                            <ShoppingCart size={18} /> Return to Cart
                        </button>
                        <button 
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                            onClick={() => navigate('/customer/marketplace')}
                        >
                            <ArrowLeft size={18} /> Continue Shopping
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default PaymentCancel;
