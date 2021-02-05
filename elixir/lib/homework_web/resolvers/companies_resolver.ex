defmodule HomeworkWeb.Resolvers.CompaniesResolver do
	alias Homework.Companies
	alias HomeworkWeb.Resolvers.Transactions

	@doc """
	Get a list of Companies
	"""
	def companies(_root, args, _info) do
		list_of_companies = Companies.list_companies(args) |> Enum.map(fn company -> amount_to_float(company) end)

		{:ok, list_of_companies}
	end

	@doc """
	Create a new company
	"""
	def create_company(_root, args, _info) do
		updated_args = amount_from_float(args);

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

	def value_from_float(value) do
    [dollar, cents] = Float.to_string(value) |> String.split(".")
    cents = case String.length(cents) do
      0 -> "00"
      1 -> "#{cents}0"
      _ -> cents
    end

    String.to_integer(dollar <> cents)
  end

  def amount_from_float(company) do
    {_, updated_company} = Map.get_and_update(company, :credit_line, fn current_value ->
      {current_value, value_from_float(current_value)}
    end)

    updated_company
  end

	def value_to_float(value) do
		strung = value |> Integer.to_string
    length_of_strung = String.length(strung);

    float_string = if length_of_strung > 2 do
      String.slice(strung, 0, length_of_strung - 2) <> "." <>  String.slice(strung, length_of_strung - 2, 2)
    else
      "0.#{strung}"
    end

    String.to_float(float_string)
	end

  def amount_to_float(transaction) do
    {_, updated_transaction} = Map.get_and_update(transaction, :available_credit, fn current_value ->  
      {current_value, value_to_float(current_value)}
    end)

    {_, updated_transaction2} = Map.get_and_update(updated_transaction, :credit_line, fn current_value ->  
      {current_value, value_to_float(current_value)}
    end)

    updated_transaction2
  end
end