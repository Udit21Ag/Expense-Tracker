import React from "react";
import { useState, useRef } from "react";

import {
	Button,
	Typography,
	Dialog,
	DialogTitle,
	IconButton,
	DialogContent,
	FormControl,
	TextField,
	DialogActions,
	MenuItem,
	Select,
	Table,
	TableContainer,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Paper,
	InputLabel,
} from "@material-ui/core";

import { Close } from "@material-ui/icons";
import "./display.css";
import { categoryList, frequencyList } from "../data/data";
import "./main.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Display() {
	const [showExpensePopup, setShowExpensePopup] = useState(false);
	const [amount, setAmount] = useState(0);
	const [category, setCategory] = useState("");
	const [frequency, setFrequency] = useState("");
	const [expenses, setExpenses] = useState([]);
	const [categoryFilter, setCategoryFilter] = useState("");
	const [frequencyFilter, setFrequencyFilter] = useState("");
	const tableRef = useRef();

	const handleOpen = () => {
		setShowExpensePopup(true);
	};

	const handleClose = () => {
		setShowExpensePopup(false);
		setAmount(0);
		setCategory("");
		setFrequency("");
	};

	const handleAmountChange = (event) => {
		setAmount(event.target.value);
	};

	const handleCategoryChange = (event) => {
		console.log("Selected Category:", event.target.value);
		setCategory(event.target.value);
	};

	const handleFrequencyChange = (event) => {
		console.log("Selected Frequency:", event.target.value);
		setFrequency(event.target.value);
	};

	const handleSubmit = () => {
		if (!category || !frequency) {
			alert("Please select both category and frequency.");
			return;
		}

		if (amount <= 0) {
			alert(
				"Please enter a valid amount (greater than 0) before submitting."
			);
			return;
		}

		const newExpense = {
			amount,
			category,
			frequency,
		};

		console.log("Expense:", newExpense);

		setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
		handleClose();
	};

	const calculateTotalExpenditure = () => {
		return expenses
			.reduce((total, expense) => total + Number(expense.amount), 0)
			.toLocaleString();
	};

	const filteredExpenses = expenses.filter((expense) => {
		const categoryMatch =
			!categoryFilter || expense.category === categoryFilter;
		const frequencyMatch =
			!frequencyFilter || expense.frequency === frequencyFilter;
		return categoryMatch && frequencyMatch;
	});

	const exportToPDF = () => {
		const unit = "pt";
		const size = "A4";
		const orientation = "portrait";
		const marginLeft = 40;
		const doc = new jsPDF(orientation, unit, size);

		doc.setFontSize(15);
		doc.text("Expense Summary", marginLeft, 20);

		const headers = [["S. No.", "Amount", "Category", "Frequency"]];
		const data = filteredExpenses.map((expense, index) => [
			index + 1,
			expense.amount,
			expense.category,
			expense.frequency,
		]);

		doc.autoTable({
			startY: 30,
			head: headers,
			body: data,
			theme: "striped",
		});

		const totalExpenditure = filteredExpenses.reduce(
			(total, expense) => total + Number(expense.amount),
			0
		);

		const startY = doc.autoTable.previous.finalY + 25;
		doc.setFontSize(12);
		doc.text(
			`Total Expenditure: Rs. ${totalExpenditure}`,
			marginLeft,
			startY
		);

		doc.save("expense_summary.pdf");
	};

	return (
		<>
			<section className="budget">
				<div className="flex-r">
					<div className="add">
						Total expenditure: Rs. {calculateTotalExpenditure()}
					</div>
					<Button
						variant="outlined"
						color="primary"
						size="large"
						onClick={handleOpen}
					>
						Add Expense
					</Button>
					<Dialog
						fullWidth
						open={showExpensePopup}
						onClose={handleClose}
					>
						<DialogTitle className="dialogTitle" disableTypography>
							<Typography variant="h6">Add Expense</Typography>
							<IconButton onClick={handleClose}>
								<Close />
							</IconButton>
						</DialogTitle>
						<DialogContent dividers>
							<FormControl fullWidth>
								<Typography variant="subtitle2">
									Expense Amount (Rs.):
								</Typography>
								<TextField
									type="number"
									value={amount}
									onChange={handleAmountChange}
									InputProps={{
										inputProps: { min: 0 },
									}}
								/>
								<br />
								<Typography variant="subtitle2">
									Category:
								</Typography>
								<Select
									value={category}
									onChange={handleCategoryChange}
									displayEmpty
								>
									<MenuItem value="" disabled>
										Select Category
									</MenuItem>
									{categoryList.map((categoryOption) => (
										<MenuItem
											key={categoryOption.id}
											value={categoryOption.label}
										>
											{categoryOption.label}
										</MenuItem>
									))}
								</Select>
								<br />
								<Typography variant="subtitle2">
									Frequency:
								</Typography>
								<Select
									value={frequency}
									onChange={handleFrequencyChange}
									displayEmpty
								>
									<MenuItem value="" disabled>
										Select Frequency
									</MenuItem>
									{frequencyList.map((frequencyOption) => (
										<MenuItem
											key={frequencyOption.id}
											value={frequencyOption.label}
										>
											{frequencyOption.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</DialogContent>
						<DialogActions>
							<Button color="primary" onClick={handleSubmit}>
								Submit
							</Button>
						</DialogActions>
					</Dialog>
				</div>
			</section>
			<section className="expense-list" ref={tableRef}>
				<Typography variant="h6">Expense History</Typography>
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Serial No.</TableCell>
								<TableCell>Amount (Rs.)</TableCell>
								<TableCell>Category</TableCell>
								<TableCell>Frequency</TableCell>
							</TableRow>
							<TableRow>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell>
									<InputLabel htmlFor="category-filter">
										Filter
									</InputLabel>
									<Select
										value={categoryFilter}
										onChange={(e) =>
											setCategoryFilter(e.target.value)
										}
										inputProps={{
											name: "category-filter",
											id: "category-filter",
										}}
									>
										<MenuItem value="">All</MenuItem>
										{categoryList.map((categoryOption) => (
											<MenuItem
												key={categoryOption.id}
												value={categoryOption.label}
											>
												{categoryOption.label}
											</MenuItem>
										))}
									</Select>
								</TableCell>
								<TableCell>
									<InputLabel htmlFor="frequency-filter">
										Filter
									</InputLabel>
									<Select
										value={frequencyFilter}
										onChange={(e) =>
											setFrequencyFilter(e.target.value)
										}
										inputProps={{
											name: "frequency-filter",
											id: "frequency-filter",
										}}
									>
										<MenuItem value="">All</MenuItem>
										{frequencyList.map(
											(frequencyOption) => (
												<MenuItem
													key={frequencyOption.id}
													value={
														frequencyOption.label
													}
												>
													{frequencyOption.label}
												</MenuItem>
											)
										)}
									</Select>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredExpenses.map((expense, index) => (
								<TableRow key={index}>
									<TableCell>{index + 1}</TableCell>
									<TableCell>{expense.amount}</TableCell>
									<TableCell>{expense.category}</TableCell>
									<TableCell>{expense.frequency}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<Button
					variant="outlined"
					color="primary"
					onClick={exportToPDF}
				>
					Export to PDF
				</Button>
			</section>
		</>
	);
}

export default Display;
