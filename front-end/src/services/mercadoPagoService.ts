export const createPayment = async (paymentData: any) => {
    try {
      const response = await fetch('/api/create_payment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao processar pagamento');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  };