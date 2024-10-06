// import React, { useState } from 'react';
// import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
// import { useAuth } from '@/contexts/AuthContext';
// import { ChatbotConfig } from '@/types';

// interface PaymentComponentProps {
//     chatbotConfig: ChatbotConfig;
//     companyInfo: any;
//     onPaymentSuccess: () => void;
// }

// const PaymentComponent: React.FC<PaymentComponentProps> = ({
//     chatbotConfig,
//     companyInfo,
//     onPaymentSuccess,
// }) => {
//     const stripe = useStripe();
//     const elements = useElements();
//     const { user, login, register } = useAuth();
//     const [isLogin, setIsLogin] = useState(true);
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [name, setName] = useState('');
//     const [error, setError] = useState('');

//     const handleAuth = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError('');
//         try {
//             if (isLogin) {
//                 await login(email, password);
//             } else {
//                 await register(name, email, password);
//             }
//         } catch (err) {
//             setError('Erreur d\'authentification. Veuillez réessayer.');
//         }
//     };

//     const handleSubmit = async (event: React.FormEvent) => {
//         event.preventDefault();

//         if (!stripe || !elements || !user) {
//             return;
//         }

//         const cardElement = elements.getElement(CardElement);

//         if (cardElement) {
//             const { error, paymentMethod } = await stripe.createPaymentMethod({
//                 type: 'card',
//                 card: cardElement,
//             });

//             if (error) {
//                 console.log('[error]', error);
//                 setError(error.message || 'Une erreur est survenue lors du paiement.');
//             } else {
//                 console.log('[PaymentMethod]', paymentMethod);
//                 // Ici, vous pouvez ajouter la logique pour envoyer le paymentMethod.id à votre serveur
//                 onPaymentSuccess();
//             }
//         }
//     };

//     if (!user) {
//         return (
//             <div className="w-full max-w-md mx-auto">
//                 <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Connexion' : 'Inscription'}</h2>
//                 <form onSubmit={handleAuth}>
//                     {!isLogin && (
//                         <div className="mb-4">
//                             <label htmlFor="name" className="block mb-2">Nom</label>
//                             <input
//                                 type="text"
//                                 id="name"
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                                 className="w-full px-3 py-2 border rounded"
//                                 required
//                             />
//                         </div>
//                     )}
//                     <div className="mb-4">
//                         <label htmlFor="email" className="block mb-2">Email</label>
//                         <input
//                             type="email"
//                             id="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             className="w-full px-3 py-2 border rounded"
//                             required
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label htmlFor="password" className="block mb-2">Mot de passe</label>
//                         <input
//                             type="password"
//                             id="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="w-full px-3 py-2 border rounded"
//                             required
//                         />
//                     </div>
//                     {error && <p className="text-red-500 mb-4">{error}</p>}
//                     <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded">
//                         {isLogin ? 'Se connecter' : 'S\'inscrire'}
//                     </button>
//                 </form>
//                 <p className="mt-4 text-center">
//                     {isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
//                     <button
//                         onClick={() => setIsLogin(!isLogin)}
//                         className="ml-2 text-primary hover:underline"
//                     >
//                         {isLogin ? 'S\'inscrire' : 'Se connecter'}
//                     </button>
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="flex flex-col md:flex-row gap-8">
//             <div className="w-full md:w-1/2">
//                 <h2 className="text-2xl font-bold mb-4">Récapitulatif de la commande</h2>
//                 <div className="space-y-4">
//                     <div>
//                         <h3 className="text-xl font-semibold">Configuration du chatbot</h3>
//                         <p>Couleur principale : {chatbotConfig.primaryColor}</p>
//                         <p>Police : {chatbotConfig.fontFamily}</p>
//                     </div>
//                     <div>
//                         <h3 className="text-xl font-semibold">Informations de l'entreprise</h3>
//                         <p>Nom : {companyInfo.name}</p>
//                         <p>Secteur : {companyInfo.industry}</p>
//                     </div>
//                     <div>
//                         <h3 className="text-xl font-semibold">Total</h3>
//                         <p className="text-2xl font-bold">99,99 €</p>
//                     </div>
//                 </div>
//             </div>
//             <div className="w-full md:w-1/2">
//                 <h2 className="text-2xl font-bold mb-4">Paiement</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-4">
//                         <CardElement
//                             options={{
//                                 style: {
//                                     base: {
//                                         fontSize: '16px',
//                                         color: '#424770',
//                                         '::placeholder': {
//                                             color: '#aab7c4',
//                                         },
//                                     },
//                                     invalid: {
//                                         color: '#9e2146',
//                                     },
//                                 },
//                             }}
//                         />
//                     </div>
//                     {error && <p className="text-red-500 mb-4">{error}</p>}
//                     <button
//                         type="submit"
//                         disabled={!stripe}
//                         className="w-full bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark"
//                     >
//                         Payer
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default PaymentComponent;