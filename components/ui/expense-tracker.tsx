"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FilePenIcon, PlusIcon, TrashIcon } from "lucide-react";
import { format } from "date-fns";

type Expense = {
  id: number;
  name: string;
  amount: number;
  date: Date;
};

const initialExpenses: Expense[] = [
  {
    id: 1,
    name: "Groceries",
    amount: 250,
    date: new Date("2024-05-15"),
  },
  {
    id: 2,
    name: "Rent",
    amount: 250,
    date: new Date("2024-06-01"),
  },
  {
    id: 3,
    name: "Utilities",
    amount: 250,
    date: new Date("2024-06-05"),
  },
  {
    id: 4,
    name: "Dining Out",
    amount: 250,
    date: new Date("2024-06-10"),
  },
];

export default function ExpenseTrackerComponent() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentExpenseId, setCurrentExpenseId] = useState<number | null>(null);
  const [newExpense, setNewExpense] = useState<{
    name: string;
    amount: string;
    date: string;  // Use string to manage date input
  }>({
    name: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),  // Default to current date
  });

  useEffect(() => {
    const storedExpenses = localStorage.getItem("expenses");
    if (storedExpenses) {
      setExpenses(
        JSON.parse(storedExpenses).map((expense: Expense) => ({
          ...expense,
          date: new Date(expense.date),
        }))
      );
    } else {
      setExpenses(initialExpenses);
    }
  }, []);

  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    }
  }, [expenses]);

  const handleAddExpense = (): void => {
    if (newExpense.name.trim() === "" || newExpense.amount === "") {
      alert("Please enter valid expense details");
      return;
    }

    setExpenses([
      ...expenses,
      {
        id: expenses.length + 1,
        name: newExpense.name,
        amount: parseFloat(newExpense.amount),
        date: new Date(newExpense.date),
      },
    ]);
    resetForm();
    setShowModal(false);
  };

  const handleEditExpense = (id: number): void => {
    const expenseToEdit = expenses.find((expense) => expense.id === id);
    if (expenseToEdit) {
      setNewExpense({
        name: expenseToEdit.name,
        amount: expenseToEdit.amount.toString(),
        date: expenseToEdit.date.toISOString().slice(0, 10),
      });
      setCurrentExpenseId(id);
      setIsEditing(true);
      setShowModal(true);
    }
  };

  const handleSaveEditExpense = (): void => {
    if (newExpense.name.trim() === "" || newExpense.amount === "") {
      alert("Please enter valid expense details");
      return;
    }

    setExpenses(
      expenses.map((expense) =>
        expense.id === currentExpenseId
          ? { ...expense, ...newExpense, amount: parseFloat(newExpense.amount), date: new Date(newExpense.date) }
          : expense
      )
    );
    resetForm();
    setShowModal(false);
  };

  const resetForm = (): void => {
    setNewExpense({
      name: "",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
    });
    setIsEditing(false);
    setCurrentExpenseId(null);
  };

  const handleDeleteExpense = (id: number): void => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setNewExpense((prevExpense) => ({
      ...prevExpense,
      [id]: value,  // Directly map the input to the state value
    }));
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#F8EBF6' }}>
      <header
        className="py-4 px-6 shadow"
        style={{
          backgroundColor: '#EAC7DC',
          color: '#5F366A',
        }}
      >
        <div className="flex justify-between items-center">
          <h1
            className="text-4xl font-bold italic"
            style={{
              fontFamily: "'Dancing Script', cursive",
            }}
          >
            Expense Tracker
          </h1>
          <div className="text-2xl font-bold">
            Total: ${totalExpenses.toFixed(2)}
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-6">
        <ul className="space-y-4">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="p-4 rounded-lg shadow flex justify-between items-center"
              style={{ backgroundColor: '#F3E6F5', color: '#5F366A' }}
            >
              <div>
                <h3 className="text-lg font-medium">{expense.name}</h3>
                <p className="text-muted-foreground">
                  ${expense.amount.toFixed(2)} -{" "}
                  {format(expense.date, "dd/MM/yyyy")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditExpense(expense.id)}
                >
                  <FilePenIcon className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteExpense(expense.id)}
                >
                  <TrashIcon className="w-5 h-5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </main>
      <div className="fixed bottom-6 right-6">
        <Button
          size="icon"
          className="rounded-full shadow-lg"
          style={{ backgroundColor: '#D497C4', color: '#FFFFFF' }}
          onClick={() => {
            setShowModal(true);
            setIsEditing(false);
            resetForm();
          }}
        >
          <PlusIcon className="w-6 h-6" />
        </Button>
      </div>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="p-6 rounded-lg shadow w-full max-w-md" style={{ backgroundColor: '#F3E6F5' }}>
          <DialogHeader>
            <DialogTitle
              style={{ color: '#5F366A', fontWeight: 'bold' }}
            >
              {isEditing ? "Edit Expense" : "Add Expense"}
            </DialogTitle>
          </DialogHeader>
          <div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name" style={{ color: '#5F366A' }}>
                  Expense Name
                </Label>
                <Input
                  id="name"
                  value={newExpense.name}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#5F366A',
                    border: '1px solid #5F366A',
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount" style={{ color: '#5F366A' }}>
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={newExpense.amount}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#5F366A',
                    border: '1px solid #5F366A',
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date" style={{ color: '#5F366A' }}>
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#5F366A',
                    border: '1px solid #5F366A',
                  }}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="ghost"
              onClick={() => setShowModal(false)}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#5F366A',
                border: '1px solid #5F366A',
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={isEditing ? handleSaveEditExpense : handleAddExpense}
              style={{ backgroundColor: '#D497C4', color: '#FFFFFF' }}
            >
              {isEditing ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
