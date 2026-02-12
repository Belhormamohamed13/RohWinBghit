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
        { id: 1, title: 'Identité', icon: <FileText size={24} />, description: 'CNI / Passeport' },
        { id: 2, title: 'Permis', icon: <Contact size={24} />, description: 'Permis de conduire' },
        { id: 3, title: 'Assurance', icon: <ShieldCheck size={24} />, description: 'Contrat d\'assurance' },
        { id: 4, title: 'Final', icon: <CheckCircle size={24} />, description: 'Confirmation' }
    ];

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Le fichier est trop volumineux (max 5Mo)');
            return;
        }

        const formData = new FormData();
        formData.append(type, file);

        setIsUploading(true);
        try {
            const response = await userApi.uploadVerificationDocs(formData);
            const newDocUrls = response.data.data;
            setDocs(prev => ({ ...prev, ...newDocUrls }));
            toast.success('Document téléchargé avec succès');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Erreur lors du téléchargement');
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
            toast.error('Veuillez télécharger tous les documents requis');
            setCurrentStep(1); // Go back if missing
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await userApi.submitVerification(docs);
            setUser(response.data.data.user);
            toast.success('Dossier soumis avec succès !');
            setCurrentStep(4);
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Erreur lors de la soumission du dossier');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <BadgeCheck className="text-[#13ec6d]" size={24} />
                                    Pièce d'Identité Nationale (CNI)
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Veuillez télécharger une copie lisible de votre carte d'identité.</p>
                            </div>
                            {user?.verificationStatus === 'verified' && (
                                <div className="bg-[#13ec6d]/10 text-[#13ec6d] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-[#13ec6d]/20 flex items-center gap-1">
                                    <Check size={14} strokeWidth={3} />
                                    Vérifié
                                </div>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Recto (Face avant)</label>
                                <div
                                    onClick={() => triggerUpload('identity_front')}
                                    className="relative group cursor-pointer"
                                >
                                    <div className={`w-full aspect-video rounded-3xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center gap-4 ${docs.identityCardFrontUrl ? 'border-[#13ec6d]/40 bg-[#13ec6d]/5' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-[#13ec6d]/50'}`}>
                                        {docs.identityCardFrontUrl ? (
                                            <>
                                                <img
                                                    alt="Identity Card Front"
                                                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                                                    src={docs.identityCardFrontUrl.startsWith('http') ? docs.identityCardFrontUrl : `http://localhost:5001${docs.identityCardFrontUrl}`}
                                                />
                                                <div className="relative z-10 flex flex-col items-center justify-center bg-slate-900/40 w-full h-full backdrop-blur-[2px]">
                                                    <CheckCircle className="text-white mb-2" size={40} />
                                                    <span className="text-white font-bold text-sm">Document Recto Chargé</span>
                                                    <span className="text-white/60 text-xs font-medium">Cliquer pour modifier</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-[#13ec6d] transition-colors">
                                                    {isUploading && uploadType === 'identity_front' ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">Télécharger le recto</p>
                                                    <p className="text-xs text-slate-500 font-medium">Format JPG, PNG (Max 5MB)</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Verso (Face arrière)</label>
                                <div
                                    onClick={() => triggerUpload('identity_back')}
                                    className="relative group cursor-pointer"
                                >
                                    <div className={`w-full aspect-video rounded-3xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center gap-4 ${docs.identityCardBackUrl ? 'border-[#13ec6d]/40 bg-[#13ec6d]/5' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-[#13ec6d]/50'}`}>
                                        {docs.identityCardBackUrl ? (
                                            <>
                                                <img
                                                    alt="Identity Card Back"
                                                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                                                    src={docs.identityCardBackUrl.startsWith('http') ? docs.identityCardBackUrl : `http://localhost:5001${docs.identityCardBackUrl}`}
                                                />
                                                <div className="relative z-10 flex flex-col items-center justify-center bg-slate-900/40 w-full h-full backdrop-blur-[2px]">
                                                    <CheckCircle className="text-white mb-2" size={40} />
                                                    <span className="text-white font-bold text-sm">Document Verso Chargé</span>
                                                    <span className="text-white/60 text-xs font-medium">Cliquer pour modifier</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-[#13ec6d] transition-colors">
                                                    {isUploading && uploadType === 'identity_back' ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">Télécharger le verso</p>
                                                    <p className="text-xs text-slate-500 font-medium">Format JPG, PNG (Max 5MB)</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Permis de conduire</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Importez les deux faces de votre permis de conduire algérien.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Recto du Permis</label>
                                <div
                                    onClick={() => triggerUpload('license_front')}
                                    className="relative group cursor-pointer"
                                >
                                    <div className={`w-full aspect-video rounded-3xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center gap-4 ${docs.licenseFrontUrl ? 'border-[#13ec6d]/40 bg-[#13ec6d]/5' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-[#13ec6d]/50'}`}>
                                        {docs.licenseFrontUrl ? (
                                            <>
                                                <img alt="License Front" className="absolute inset-0 w-full h-full object-cover" src={docs.licenseFrontUrl.startsWith('http') ? docs.licenseFrontUrl : `http://localhost:5001${docs.licenseFrontUrl}`} />
                                                <div className="relative z-10 flex flex-col items-center justify-center bg-slate-900/40 w-full h-full backdrop-blur-[2px]">
                                                    <CheckCircle className="text-white mb-2" size={40} />
                                                    <span className="text-white font-bold text-sm">Permis Recto Chargé</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center">
                                                {isUploading && uploadType === 'license_front' ? <Loader2 className="animate-spin mx-auto text-[#13ec6d] mb-2" size={32} /> : <Upload className="mx-auto text-slate-400 mb-2" size={32} />}
                                                <p className="font-bold text-sm">Télécharger le Recto</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Verso du Permis</label>
                                <div
                                    onClick={() => triggerUpload('license_back')}
                                    className="relative group cursor-pointer"
                                >
                                    <div className={`w-full aspect-video rounded-3xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center gap-4 ${docs.licenseBackUrl ? 'border-[#13ec6d]/40 bg-[#13ec6d]/5' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-[#13ec6d]/50'}`}>
                                        {docs.licenseBackUrl ? (
                                            <>
                                                <img alt="License Back" className="absolute inset-0 w-full h-full object-cover" src={docs.licenseBackUrl.startsWith('http') ? docs.licenseBackUrl : `http://localhost:5001${docs.licenseBackUrl}`} />
                                                <div className="relative z-10 flex flex-col items-center justify-center bg-slate-900/40 w-full h-full backdrop-blur-[2px]">
                                                    <CheckCircle className="text-white mb-2" size={40} />
                                                    <span className="text-white font-bold text-sm">Permis Verso Chargé</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center">
                                                {isUploading && uploadType === 'license_back' ? <Loader2 className="animate-spin mx-auto text-[#13ec6d] mb-2" size={32} /> : <Upload className="mx-auto text-slate-400 mb-2" size={32} />}
                                                <p className="font-bold text-sm">Télécharger le Verso</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="py-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-400">
                            <ShieldCheck size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Documents du véhicule</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
                            Les documents du véhicule (Assurance, Carte Grise) sont à ajouter lors de l'enregistrement de votre véhicule dans la section correspondante.
                        </p>
                    </div>
                );
            case 4:
                return (
                    <div className="py-20 text-center">
                        <div className="w-20 h-20 bg-[#13ec6d]/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-[#13ec6d]">
                            <CheckCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 uppercase tracking-tight">C'est envoyé !</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                            Votre dossier est maintenant en cours d'examen. Nos agents vérifieront l'authenticité de vos documents sous 48h.
                        </p>
                        {user?.verificationStatus === 'pending' && (
                            <div className="mt-8 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-2xl flex items-center gap-3 max-w-md mx-auto">
                                <Info size={20} />
                                <span className="text-sm font-bold">Statut : Validation en attente</span>
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

            <div className="max-w-5xl mx-auto py-4">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-[#13ec6d] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#13ec6d]/30">
                            <BadgeCheck size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Vérification du Profil</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium italic text-sm">
                                {user?.verificationStatus === 'verified' ? 'Votre compte est certifié ✅' : 'Devenez un chauffeur certifié RohWinBghit'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Progress Stepper with Animated Lines */}
                <div className="flex items-center justify-between mb-16 relative px-4">
                    {steps.map((step, index) => {
                        const isActive = currentStep === step.id;
                        const isPast = currentStep > step.id;

                        return (
                            <React.Fragment key={step.id}>
                                <div
                                    onClick={() => setCurrentStep(step.id)}
                                    className={`flex flex-col items-center gap-3 cursor-pointer transition-all duration-500 group ${isActive ? 'scale-110' : isPast ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 relative ${isActive
                                        ? 'bg-[#13ec6d] text-white shadow-2xl shadow-[#13ec6d]/40 ring-4 ring-[#13ec6d]/10'
                                        : isPast ? 'bg-[#13ec6d]/20 text-[#13ec6d]' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                        }`}>
                                        {isPast ? <Check size={24} strokeWidth={4} /> : step.icon}
                                        {isActive && (
                                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
                                                <span className="w-2 h-2 bg-[#13ec6d] rounded-full animate-ping"></span>
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <span className={`text-[10px] uppercase font-black tracking-[0.2em] block mb-0.5 ${isActive ? 'text-[#13ec6d]' : 'text-slate-400'}`}>
                                            STAGE {step.id}
                                        </span>
                                        <span className={`text-sm font-extrabold transition-colors ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                                            {step.title}
                                        </span>
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="flex-1 h-[3px] mx-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative -mt-8">
                                        <motion.div
                                            initial={{ width: "0%" }}
                                            animate={{ width: isPast ? "100%" : "0%" }}
                                            transition={{ duration: 0.6, ease: "easeInOut" }}
                                            className="h-full bg-[#13ec6d] shadow-[0_0_10px_#13ec6d]"
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Main Content Card */}
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-14 shadow-[0_40px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 transition-all duration-500">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, scale: 0.98, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.02, y: -20 }}
                            transition={{ duration: 0.4, ease: "backOut" }}
                        >
                            {renderStepContent()}
                        </motion.div>
                    </AnimatePresence>

                    {/* Guidelines Box */}
                    <div className="mt-14 p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-200 dark:border-slate-800 group hover:border-[#13ec6d]/20 transition-colors">
                        <h4 className="text-sm font-black flex items-center gap-3 mb-4 text-slate-900 dark:text-white uppercase tracking-wider">
                            <div className="p-2 bg-amber-500 rounded-xl text-white">
                                <Info size={18} />
                            </div>
                            Conseils pour une validation rapide
                        </h4>
                        <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-3 list-none pl-1 font-bold leading-relaxed">
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[#13ec6d] rounded-full"></div>
                                Utilisez une lumière naturelle et évitez le flash pour réduire les reflets.
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[#13ec6d] rounded-full"></div>
                                Les 4 coins du document doivent être visibles et inscrits dans le cadre.
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[#13ec6d] rounded-full"></div>
                                Si le document est expiré, il sera automatiquement rejeté.
                            </li>
                        </ul>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-12 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-10">
                        <button
                            disabled={currentStep === 1 || isSubmitting}
                            onClick={() => setCurrentStep(prev => prev - 1)}
                            className="flex items-center gap-3 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all font-black uppercase tracking-widest text-xs disabled:opacity-20 group"
                        >
                            <div className="p-3 rounded-xl border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-all">
                                <ArrowLeft size={18} />
                            </div>
                            Retour
                        </button>

                        <button
                            disabled={isUploading || isSubmitting || user?.verificationStatus === 'verified'}
                            onClick={() => currentStep === 4 ? handleSubmit() : setCurrentStep(next => Math.min(next + 1, 4))}
                            className="bg-[#13ec6d] text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center gap-4 shadow-2xl shadow-[#13ec6d]/30 hover:shadow-[#13ec6d]/50 hover:scale-[1.03] active:scale-95 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (currentStep === 4 ? 'Soumettre Dossier' : 'Continuer')}
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </DriverLayout>
    );
};

export default Verification;
