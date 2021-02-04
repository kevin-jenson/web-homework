# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Homework.Repo.insert!(%Homework.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
alias Homework.Repo
alias Homework.Users.User
alias Homework.Merchants.Merchant
alias Homework.Transactions.Transaction
alias Homework.Companies.Company

company1 = Repo.insert! %Company{
	name: "Company 1",
	credit_line: 10000,
	available_credit: 10000,
}

company2 = Repo.insert! %Company{
	name: "Company 2",
	credit_line: 2000,
	available_credit: 2000,
}

company3 = Repo.insert! %Company{
	name: "Company 3",
	credit_line: 30,
	available_credit: 30,
}

Repo.insert! %User{
	dob: "07-10-1996",
	first_name: "Kevin",
	last_name: "Jenson",
	company_id: company1.id
}

Repo.insert! %User{
	dob: "07-12-2018",
	first_name: "Mila",
	last_name: "Jenson",
	company_id: company2.id
}

Repo.insert! %User{
	dob: "08-28-1995",
	first_name: "James",
	last_name: "Jones",
	company_id: company1.id
}

Repo.insert! %Merchant{
	name: "Merchant 1",
	description: "The first Merchant"
}

Repo.insert! %Merchant{
	name: "Merchant 2",
	description: "The second Merchant"
}
