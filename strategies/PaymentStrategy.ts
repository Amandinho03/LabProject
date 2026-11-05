export interface PaymentUserDetails {
  id: number;
  username: string;
  email?: string;
}

export interface PaymentStrategy {
  processPayment(
    amount: number,
    userDetails: PaymentUserDetails,
  ): Promise<boolean>;
}

export class UPIPaymentStrategy implements PaymentStrategy {
  async processPayment(
    amount: number,
    userDetails: PaymentUserDetails,
  ): Promise<boolean> {
    console.log(`Routing Rs.${amount} via UPI for ${userDetails.username}`);
    //logic
    return true;
  }
}

export class UniversityGrantStrategy implements PaymentStrategy {
  async processPayment(
    amount: number,
    userDetails: PaymentUserDetails,
  ): Promise<boolean> {
    console.log(
      `Deducting Rs.${amount} from the internal grant for ${userDetails.username}`,
    );
    //logic
    return true;
  }
}

export type FundingMode = "GRANT" | "UPI";

export class PaymentProcessor {
  private strategy: PaymentStrategy;

  constructor(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }

  async execute(
    amount: number,
    userDetails: PaymentUserDetails,
  ): Promise<boolean> {
    return await this.strategy.processPayment(amount, userDetails);
  }

  static fromMode(mode: FundingMode = "GRANT"): PaymentProcessor {
    const strategies: Record<FundingMode, PaymentStrategy> = {
      GRANT: new UniversityGrantStrategy(),
      UPI: new UPIPaymentStrategy(),
    };
    return new PaymentProcessor(strategies[mode] ?? strategies.GRANT);
  }
}
