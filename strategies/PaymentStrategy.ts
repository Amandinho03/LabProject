export interface PaymentUserDetails {
  id: number;
  username: string;
  email?: string;
}


export interface PaymentStrategy {
  processPayment(amount: number, userDetails: PaymentUserDetails): Promise<boolean>;
}


export class UPIPaymentStrategy implements PaymentStrategy {
  async processPayment(amount: number, userDetails: PaymentUserDetails): Promise<boolean> {
    console.log(`Routing Rs.${amount} via UPI for ${userDetails.username}`);
    //logic    
    return true;
  }
}

export class UniversityGrantStrategy implements PaymentStrategy {
  async processPayment(amount: number, userDetails: PaymentUserDetails): Promise<boolean> {
    console.log(`Deducting Rs.${amount} from the internal grant for ${userDetails.username}`);
    //logic
    return true;
  }
}