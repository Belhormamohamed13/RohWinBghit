import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { authApi } from '../../services/api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await authApi.forgotPassword(email)
      setIsSent(true)
      toast.success('Email de réinitialisation envoyé!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSent) {
    return (
      <div className="min-h-screen bg-dark-50 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-elevated p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-dark-900 mb-2">Email envoyé!</h2>
          <p className="text-dark-500 mb-6">
            Vérifiez votre boîte de réception pour les instructions de réinitialisation.
          </p>
          <Link to="/login" className="btn-primary inline-flex">
            Retour à la connexion
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-elevated p-8">
          <Link to="/login" className="inline-flex items-center text-dark-500 hover:text-dark-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>

          <h2 className="text-2xl font-bold text-dark-900 mb-2">Mot de passe oublié?</h2>
          <p className="text-dark-500 mb-6">
            Entrez votre email et nous vous enverrons un lien de réinitialisation.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 disabled:opacity-50"
            >
              {isLoading ? 'Envoi...' : 'Envoyer le lien'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword
