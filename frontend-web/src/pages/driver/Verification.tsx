import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BadgeCheck,
    Contact,
    ShieldCheck,
    CheckCircle,
    FileText,
    Upload,
    Info,
    ArrowLeft,
    ArrowRight,
    Check,
    Loader2
} from 'lucide-react';
import React from 'react';
import { toast } from 'react-hot-toast';
import DriverLayout from '../../components/layout/DriverLayout';
import { useAuthStore } from '../../store/authStore';
import { userApi } from '../../services/api';

const Verification = () => {
    const { user, setUser } = useAuthStore();
    const [currentStep, setCurrentStep] = useState(1);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state for document URLs
    const [docs, setDocs] = useState({
        identityCardFrontUrl: user?.identityCardFrontUrl || '',
        identityCardBackUrl: user?.identityCardBackUrl || '',
        licenseFrontUrl: user?.licenseFrontUrl || '',
        licenseBackUrl: user?.licenseBackUrl || '',
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadType, setUploadType] = useState<string | null>(null);

    const steps = [
        { id: 1, title: 'Identity', icon: <FileText size={20} />, description: 'ID Card / Passport' },
        { id: 2, title: 'License', icon: <Contact size={20} />, description: 'Driver License' },
        { id: 3, title: 'Insurance', icon: <ShieldCheck size={20} />, description: 'Insurance Doc' },
        { id: 4, title: 'Review', icon: <CheckCircle size={20} />, description: 'Final Assessment' }
    ];

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File too large (max 5MB)');
            return;
        }

        const formData = new FormData();
        formData.append(type, file);

        setIsUploading(true);
        try {
            const response = await userApi.uploadVerificationDocs(formData);
            const newDocUrls = response.data.data;
            setDocs(prev => ({ ...prev, ...newDocUrls }));
            toast.success('Document uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const triggerUpload = (type: string) => {
        setUploadType(type);
        fileInputRef.current?.click();
    };

    const handleSubmit = async () => {
        if (!docs.identityCardFrontUrl || !docs.identityCardBackUrl || !docs.licenseFrontUrl || !docs.licenseBackUrl) {
            toast.error('Please upload all required documents');
            setCurrentStep(1);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await userApi.submitVerification(docs);
            setUser(response.data.data.user);
            toast.success('Documents submitted successfully!');
            setCurrentStep(4);
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Submission failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-display text-white flex items-center gap-3">
                                    <BadgeCheck className="text-accent-teal" size={28} />
                                    NATIONAL IDENTITY CARD
                                </h3>
                                <p className="text-white/60 text-sm mt-1 font-body">Please upload a clear copy of your national ID.</p>
                            </div>
                            {user?.verificationStatus === 'verified' && (
                                <div className="bg-green-500/20 text-green-400 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-green-500/30 flex items-center gap-2">
                                    <Check size={14} strokeWidth={3} />
                                    VERIFIED
                                </div>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {['identity_front', 'identity_back'].map((type) => {
                                const isFront = type === 'identity_front';
                                const url = isFront ? docs.identityCardFrontUrl : docs.identityCardBackUrl;
                                const label = isFront ? 'Front Side' : 'Back Side';

                                return (
                                    <div key={type} className="space-y-3">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-white/50 ml-1 font-mono">{label}</label>
                                        <div
                                            onClick={() => triggerUpload(type)}
                                            className={`relative group cursor-pointer w-full aspect-video rounded-3xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center gap-4 ${url ? 'border-accent-teal/50 bg-accent-teal/5' : 'border-white/10 bg-white/5 hover:bg-accent-teal/10 hover:border-accent-teal/30'
                                                }`}
                                        >
                                            {url ? (
                                                <>
                                                    <img
                                                        alt={label}
                                                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                                                        src={url.startsWith('http') ? url : `http://localhost:5001${url}`}
                                                    />
                                                    <div className="relative z-10 flex flex-col items-center justify-center bg-night-900/60 w-full h-full backdrop-blur-[2px]">
                                                        <CheckCircle className="text-accent-teal mb-2" size={40} />
                                                        <span className="text-white font-bold text-sm font-mono uppercase tracking-wider">Uploaded</span>
                                                        <span className="text-white/60 text-[10px] font-mono mt-1">Click to change</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:text-accent-teal group-hover:bg-accent-teal/20 transition-all">
                                                        {isUploading && uploadType === type ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="font-bold text-white text-sm font-body">Upload {label}</p>
                                                        <p className="text-[10px] text-white/40 font-mono mt-1">JPG, PNG (Max 5MB)</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <h3 className="text-2xl font-display text-white mb-2">DRIVER'S LICENSE</h3>
                            <p className="text-white/60 font-body">Upload both sides of your valid driver's license.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {['license_front', 'license_back'].map((type) => {
                                const isFront = type === 'license_front';
                                const url = isFront ? docs.licenseFrontUrl : docs.licenseBackUrl;
                                const label = isFront ? 'Front Side' : 'Back Side';

                                return (
                                    <div key={type} className="space-y-3">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-white/50 ml-1 font-mono">{label}</label>
                                        <div
                                            onClick={() => triggerUpload(type)}
                                            className={`relative group cursor-pointer w-full aspect-video rounded-3xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center gap-4 ${url ? 'border-accent-teal/50 bg-accent-teal/5' : 'border-white/10 bg-white/5 hover:bg-accent-teal/10 hover:border-accent-teal/30'
                                                }`}
                                        >
                                            {url ? (
                                                <>
                                                    <img
                                                        alt={label}
                                                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                                                        src={url.startsWith('http') ? url : `http://localhost:5001${url}`}
                                                    />
                                                    <div className="relative z-10 flex flex-col items-center justify-center bg-night-900/60 w-full h-full backdrop-blur-[2px]">
                                                        <CheckCircle className="text-accent-teal mb-2" size={40} />
                                                        <span className="text-white font-bold text-sm font-mono uppercase tracking-wider">Uploaded</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center">
                                                    {isUploading && uploadType === type ?
                                                        <Loader2 className="animate-spin mx-auto text-accent-teal mb-2" size={32} /> :
                                                        <Upload className="mx-auto text-white/40 mb-2 group-hover:text-accent-teal transition-colors" size={32} />
                                                    }
                                                    <p className="font-bold text-sm text-white font-body">Upload {label}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="py-20 text-center animate-fade-in">
                        <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-accent-teal border border-white/10">
                            <ShieldCheck size={48} />
                        </div>
                        <h3 className="text-3xl font-display text-white mb-4 tracking-wide">VEHICLE INSURANCE</h3>
                        <p className="text-white/60 max-w-md mx-auto font-body text-lg leading-relaxed">
                            Please upload vehicle documents (Insurance, Registration) in the <span className="text-accent-teal font-bold">My Vehicles</span> section after verification.
                        </p>
                    </div>
                );
            case 4:
                return (
                    <div className="py-20 text-center animate-fade-in">
                        <div className="w-24 h-24 bg-accent-teal/20 rounded-full flex items-center justify-center mx-auto mb-8 text-accent-teal box-shadow-glow">
                            <CheckCircle size={48} />
                        </div>
                        <h3 className="text-4xl font-display text-white mb-4 tracking-wide">SUBMISSION COMPLETE</h3>
                        <p className="text-white/60 max-w-md mx-auto font-body text-lg leading-relaxed mb-8">
                            Your documents have been securely transmitted. Our team will verify your profile within 48 hours.
                        </p>
                        {user?.verificationStatus === 'pending' && (
                            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-6 py-4 rounded-xl flex items-center gap-3 max-w-md mx-auto">
                                <Info size={24} />
                                <span className="font-bold flex-1 text-left font-mono text-sm">STATUS: PENDING VALIDATION</span>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <DriverLayout>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => uploadType && handleFileUpload(e, uploadType)}
            />

            <div className="min-h-screen text-white p-6 md:p-10 font-body">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-6 mb-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-accent-teal to-accent-teal/50 rounded-2xl flex items-center justify-center text-night-900 shadow-glow">
                            <BadgeCheck size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-display text-white tracking-wide mb-1">PROFILE VERIFICATION</h1>
                            <p className="text-white/60 font-body text-lg">
                                {user?.verificationStatus === 'verified' ? 'Your account is fully verified ✅' : 'Become a trusted RohWin driver'}
                            </p>
                        </div>
                    </div>

                    {/* Progress Stepper */}
                    <div className="flex items-center justify-between mb-16 relative px-4">
                        {steps.map((step, index) => {
                            const isActive = currentStep === step.id;
                            const isPast = currentStep > step.id;

                            return (
                                <React.Fragment key={step.id}>
                                    <div
                                        onClick={() => setCurrentStep(step.id)}
                                        className={`flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 group ${isActive ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${isActive
                                            ? 'bg-accent-teal text-night-900 border-accent-teal shadow-glow'
                                            : isPast ? 'bg-accent-teal/20 text-accent-teal border-accent-teal/50' : 'bg-white/5 text-white/40 border-white/10'
                                            }`}>
                                            {isPast ? <Check size={20} strokeWidth={3} /> : step.icon}
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${isActive ? 'text-accent-teal' : 'text-white/40'}`}>
                                            {step.title}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="flex-1 h-[2px] mx-4 bg-white/10 rounded-full relative">
                                            <div
                                                className="absolute inset-y-0 left-0 bg-accent-teal transition-all duration-500 shadow-[0_0_10px_#1adfb8]"
                                                style={{ width: isPast ? '100%' : '0%' }}
                                            />
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-14 border border-white/10 shadow-card min-h-[500px] flex flex-col justify-between relative overflow-hidden">
                        {/* Radioactive Glow */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-teal/5 rounded-full blur-[100px] -mt-32 -mr-32 pointer-events-none"></div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="relative z-10"
                            >
                                {renderStepContent()}
                            </motion.div>
                        </AnimatePresence>

                        {/* Footer Actions */}
                        <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-10 relative z-10">
                            <button
                                disabled={currentStep === 1 || isSubmitting}
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                className="flex items-center gap-3 text-white/40 hover:text-white transition-all font-bold uppercase tracking-widest text-xs disabled:opacity-0"
                            >
                                <div className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all">
                                    <ArrowLeft size={16} />
                                </div>
                                Back
                            </button>

                            <button
                                disabled={isUploading || isSubmitting || user?.verificationStatus === 'verified'}
                                onClick={() => currentStep === 4 ? handleSubmit() : setCurrentStep(next => Math.min(next + 1, 4))}
                                className="bg-accent-teal text-night-900 px-12 py-4 rounded-full font-bold uppercase tracking-widest text-sm flex items-center gap-4 shadow-glow hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (currentStep === 4 ? 'Confirm Submission' : 'Continue')}
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Security Note */}
                    <div className="mt-8 text-center flex items-center justify-center gap-2 text-white/20 font-mono text-[10px] uppercase tracking-widest">
                        <ShieldCheck size={12} />
                        Secure Encrypted Upload
                    </div>
                </div>
            </div>
        </DriverLayout>
    );
};

export default Verification;
