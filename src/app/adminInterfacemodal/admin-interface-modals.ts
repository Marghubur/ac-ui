export interface PaymentDetail {
  amount: number,
  isPaid: boolean,
  installmentNumber: number,
  paymentDate: Date
}

export interface TransactionFilter {
  name?: string,
  fromDate?: Date,
  toDate?: Date,
  status?: boolean
}

export interface user {
  rowIndex?: number,
  userId: number,
  firstName: string,
  lastName: string,
  address: string,
  mobileNumber: string,
  alternateNumber?: string,
  emailId: string,
  accountId: string,
  referenceId?: number,
  dob?: Date,
  createdBy?: number,
  updatedBy?: number,
  createdOn?: Date,
  updatedOn?: Date,
  total?: number,
  name?: string,
  ProfileImgPath?: string;
  aadharNumber?: string;
  referenceBy?: string;
  productType?: number;
}

export interface CDProduct {
  cdProductId: number;
  productName: string;
  emiAmount: number;
  finalPrice: number;
  period: number;
  downPayment: number;
  loanAmount: number;
  totalPayableAmount: number;
  payableAmountToOffice: number;
  emiStartDate: Date;
  emiEndDate?: Date;
  firstName?: string;
  lastName?: string;
  accountId?: string;
  depositDate?: Date;
  userId: number;
  percentage: number;
  createdOn?: Date;  
  total?: number;
  isPaid?: boolean;
}

export interface Investment {
  investmentId: number;
  investmentAmount: number;
  addOn: number;
  principalAmount: number;
  profitAmount: number;
  period: number;
  totalProfitAmount: number;
  totalPayableAmount: number;
  istPaymentDate?: Date;
  lastPaymentDate?: Date;
  investmentDate?: Date;
  scheme: number;
  paidInstallment?: number;
  firstName?: string;
  lastName?: string;
  accountId?: string;
  total?: number;
  isPaid?: boolean;
  paymentDate?: Date;
}

export interface InvestmentType {
  investmentTypeId: number;
  amount: number,
  month: number;
}

