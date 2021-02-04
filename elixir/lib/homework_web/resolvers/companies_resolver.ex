defmodule HomeworkWeb.Resolvers.CompaniesResolver do
	alias Homework.Companies

	@doc """
	Get a list of Companies
	"""
	def companies(_root, args, _info) do
		{:ok, Companies.list_companies(args)}
	end

	@doc """
	Create a new company
	"""
	def create_company(_root, args, _info) do
		case Companies.create_company(args) do
			{:ok, company} -> {:ok, company}
			error -> {:error, "could not create company: #{inspect(error)}"}
		end
	end

	@doc """
  Updates a company for an id with args specified.
  """
  def update_company(_root, %{id: id} = args, _info) do
    company = Companies.get_company!(id)

    case Company.update_company(company, args) do
      {:ok, company} -> {:ok, company}
			error -> {:error, "could not update user: #{inspect(error)}"}
    end
  end
end