import React, { useState, useEffect } from "react";

let Home = () => {
	let [todo, setTodo] = useState("");
	let [list, setList] = useState([]);

	const createUsername = async () => {
		try {
			const response = await fetch("https://playground.4geeks.com/todo/users/Nicksteel91", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify([])
			});
			await response.json();
			console.log("User created successfully.");
		} catch (error) {
			console.error("Error creating user:", error);
		}
	};

	const fetchChores = async () => {
		try {
			const response = await fetch("https://playground.4geeks.com/todo/users/Nicksteel91");

			if (response.status === 404) {
				console.warn("User not found. Creating...");
				await createUsername();
				return fetchChores(); // retry after creation
			}

			const data = await response.json();

			if (Array.isArray(data.todos)) {
				setList(data.todos);
			}
		} catch (error) {
			console.error("Fetch error:", error);
		}
	};

	const createChore = (choreLabel) => {
		fetch(`https://playground.4geeks.com/todo/todos/Nicksteel91`, {
			method: "POST",
			body: JSON.stringify({ label: choreLabel, is_done: false }),
			headers: { "Content-Type": "application/json" }
		})
			.then(() => {
				setTodo("");
				fetchChores();
			})
			.catch(error => console.error("There was an error creating chore:", error));
	};

	const handleDel = (choreId) => {
		fetch(`https://playground.4geeks.com/todo/todos/${choreId}`, {
			method: "DELETE"
		})
			.then(() => fetchChores())
			.catch(error => console.error("There was an error deleting chore:", error));
	};

	useEffect(() => {
		fetchChores();
	}, []);

	return (
		<div>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					if (todo.trim() === "") return;
					createChore(todo);
				}}
			>
				<p className="d-flex justify-content-center title">My To Dos</p>
				<div className="card">
					<input
						type="text"
						placeholder="Please write a To Do"
						value={todo}
						onChange={(event) => setTodo(event.target.value)}
					/>
					<ul>
						{list.map((chore) => (
							<li key={chore.id} className="listformat">
								{chore.label}
								<div className="btn-group float-end">
									<button
										type="button"
										className="btn-close"
										onClick={() => handleDel(chore.id)}
									></button>
								</div>
							</li>
						))}
						<li className="listformat">{list.length} To Dos left</li>
					</ul>
				</div>
			</form>
		</div>
	);
};

export default Home;