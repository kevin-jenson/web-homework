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

user1= Repo.insert! %User{
	dob: "07-10-1996",
	first_name: "Kevin",
	last_name: "Jenson",
	company_id: company1.id
}

user2 = Repo.insert! %User{
	dob: "07-12-2018",
	first_name: "Mila",
	last_name: "Jenson",
	company_id: company2.id
}

user3 = Repo.insert! %User{
	dob: "08-28-1995",
	first_name: "James",
	last_name: "Jones",
	company_id: company1.id
}

merchant1 = Repo.insert! %Merchant{
	name: "Merchant 1",
	description: "The first Merchant"
}

merchant2 = Repo.insert! %Merchant{
	name: "Merchant 2",
	description: "The second Merchant"
}

company1_transaction = 10
Repo.insert! %Transaction{
	amount: company1_transaction,
	credit: true,
	debit: false,
	description: "transaction 1",
	merchant_id: merchant1.id,
	user_id: user1.id,
	company_id: company1.id	
}

company2_transaction = 15
Repo.insert! %Transaction{
	amount: company2_transaction,
	credit: true,
	debit: false,
	description: "transaction 2",
	merchant_id: merchant2.id,
	user_id: user1.id,
	company_id: company2.id	
}

company3_transaction = 4
Repo.insert! %Transaction{
	amount: company3_transaction,
	credit: false,
	debit: true,
	description: "transaction 3",
	merchant_id: merchant1.id,
	user_id: user3.id,
	company_id: company3.id	
}

company_1 = Repo.get!(Company, company1.id)
changeset1 = Company.changeset(company_1, %{available_credit: company_1.available_credit - company1_transaction})
Repo.update(changeset1)

company_2 = Repo.get!(Company, company2.id)
changeset2 = Company.changeset(company_2, %{available_credit: company_2.available_credit - company2_transaction})
Repo.update(changeset2)

company_3 = Repo.get!(Company, company3.id)
changeset3 = Company.changeset(company_3, %{available_credit: company_3.available_credit - company3_transaction})
Repo.update(changeset3)

