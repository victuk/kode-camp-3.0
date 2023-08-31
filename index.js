
const moment = require("moment");
// // Object-oriented Programming// Encapsulation// Abstraction// Inheritance// Polymorphism

// class Bank {
//     constructor(bankName, location) {
//         this.bankName = bankName;
//         this.location = location;
//     }

//     callMe() {
//         console.log("Called");
//     }
// }

// class BankAccount extends Bank {
//     #balance;
//     constructor(bankName, location, name, balance) { 
//         super(bankName, location);
//         this.name = name;
//         this.#balance = balance; }
//     deposit(cash) { this.#balance += cash; return this.#balance; }
//     #withdraw(cash) {
//         if (this.#balance - cash < 0) return console.log("Insufficient balance");
//         this.#balance -= cash; return this.#balance;
//     }
//     balanceEnquiry() { return "Hello " + this.name + " your account balance is " + this.#balance; }
//     withdrawIfBalanceIsGreaterThan20000(cash) {
//         if (this.#balance < 20000) return console.log("Not allowed to withdraw");
//         return this.#withdraw(cash);
//     }
// }
// const solomon = new BankAccount("Ze Bank", "Nigeria", "Solomon Sunday", 4000);
// const lois = new BankAccount("Ze Bank", "Nigeria", "Nkieru Lois", 7000);

// console.log(solomon.bankName);
// solomon.callMe();



console.log(moment(new Date().toISOString()).format( "Do MMMM YYYY"));
