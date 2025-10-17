type User = {
  id: string;
  email: string;
  name: string;
};

type Book = {
  id: string;
  title: string;
  author: string;
  description: string | null;
};

export type Loan = {
  id: string;
  loanDate: Date;
  returnDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  book: Book;
};

export type LoanByUser = Omit<Loan, 'user'>;

export type LoanByBook = Omit<Loan, 'book'>;
