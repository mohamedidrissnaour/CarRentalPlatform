import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiCreditCard, FiLock } from 'react-icons/fi';

const PaymentForm = ({ onSubmit, totalAmount, loading = false }) => {
  const [paymentMethod, setPaymentMethod] = useState('CARTE_CREDIT');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const onFormSubmit = (data) => {
    onSubmit({ ...data, methodePaiement: paymentMethod });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Méthode de paiement</h3>
        <div className="grid grid-cols-2 gap-4">
          {['CARTE_CREDIT', 'PAYPAL', 'VIREMENT_BANCAIRE', 'ESPECES'].map(
            (method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  paymentMethod === method
                    ? 'border-primary bg-primary bg-opacity-10'
                    : 'border-gray-300 hover:border-primary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FiCreditCard className="w-5 h-5" />
                  <span className="font-medium">
                    {method.replace('_', ' ')}
                  </span>
                </div>
              </button>
            )
          )}
        </div>
      </div>

      {paymentMethod === 'CARTE_CREDIT' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de carte
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              {...register('numeroCarte', {
                required: 'Le numéro de carte est requis',
                pattern: {
                  value: /^[0-9\s]{13,19}$/,
                  message: 'Numéro de carte invalide',
                },
              })}
              className="input-field"
            />
            {errors.numeroCarte && (
              <p className="text-danger text-sm mt-1">
                {errors.numeroCarte.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'expiration
              </label>
              <input
                type="text"
                placeholder="MM/AA"
                {...register('dateExpiration', {
                  required: 'La date d\'expiration est requise',
                  pattern: {
                    value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                    message: 'Format invalide (MM/AA)',
                  },
                })}
                className="input-field"
              />
              {errors.dateExpiration && (
                <p className="text-danger text-sm mt-1">
                  {errors.dateExpiration.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                placeholder="123"
                {...register('cvv', {
                  required: 'Le CVV est requis',
                  pattern: {
                    value: /^[0-9]{3,4}$/,
                    message: 'CVV invalide',
                  },
                })}
                className="input-field"
              />
              {errors.cvv && (
                <p className="text-danger text-sm mt-1">
                  {errors.cvv.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom sur la carte
            </label>
            <input
              type="text"
              placeholder="Jean Dupont"
              {...register('nomCarte', {
                required: 'Le nom sur la carte est requis',
              })}
              className="input-field"
            />
            {errors.nomCarte && (
              <p className="text-danger text-sm mt-1">
                {errors.nomCarte.message}
              </p>
            )}
          </div>
        </div>
      )}

      {paymentMethod === 'PAYPAL' && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            Vous serez redirigé vers PayPal pour finaliser le paiement.
          </p>
        </div>
      )}

      {paymentMethod === 'VIREMENT_BANCAIRE' && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            Les coordonnées bancaires vous seront communiquées par email.
          </p>
        </div>
      )}

      {paymentMethod === 'ESPECES' && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">
            Le paiement en espèces se fera lors de la récupération du véhicule.
          </p>
        </div>
      )}

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total à payer</span>
          <span className="text-2xl font-bold text-primary">
            {formatPrice(totalAmount)}
          </span>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Traitement...</span>
            </>
          ) : (
            <>
              <FiLock className="w-5 h-5" />
              <span>Payer maintenant</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;

