defmodule HomeworkWeb.Resolvers.TransactionsResolver do
  alias Homework.Merchants
  alias Homework.Transactions
  alias Homework.Users
  alias Homework.Companies

  @doc """
  Get a list of transcations
  """
  def transactions(_root, args, _info) do
    updated_args = case args do
      %{min: min, max: max} -> %{min: value_from_float(min), max: value_from_float(max)}
      %{min: min} -> %{min: value_from_float(min)}
      %{max: max} -> %{max: value_from_float(max)}
      _ -> %{}
    end

    list_of_transactions = Transactions.list_transactions(updated_args) |> Enum.map(fn transaction -> 
      amount_to_float(transaction)
    end)

    {:ok, list_of_transactions}
  end

  @doc """
  Get the user associated with a transaction
  """
  def user(_root, _args, %{source: %{user_id: user_id}}) do
    {:ok, Users.get_user!(user_id)}
  end

  @doc """
  Get the merchant associated with a transaction
  """
  def merchant(_root, _args, %{source: %{merchant_id: merchant_id}}) do
    {:ok, Merchants.get_merchant!(merchant_id)}
  end

  @doc """
  Get the company associated with a transaction
  """
  def merchant(_root, _args, %{source: %{company_id: company_id}}) do
    {:ok, Companies.get_company!(company_id)}
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

  def amount_from_float(transaction) do
    {_, updated_transaction} = Map.get_and_update(transaction, :amount, fn current_value ->
      {current_value, value_from_float(current_value)}
    end)

    updated_transaction
  end

  def amount_to_float(transaction) do
    {_, updated_transaction} = Map.get_and_update(transaction, :amount, fn current_value ->
      strung = current_value |> Integer.to_string
      length_of_strung = String.length(strung);

      float_string = if length_of_strung > 2 do
        String.slice(strung, 0, length_of_strung - 2) <> "." <>  String.slice(strung, length_of_strung - 2, 2)
      else
        "0.#{strung}"
      end

      updated_value = String.to_float(float_string)
      {current_value, updated_value}
    end)

    updated_transaction
  end

  @doc """
  Create a new transaction
  """
  def create_transaction(_root, args, _info) do
    company = Companies.get_company!(args.company_id)
    updated_args = amount_from_float(args)
    
    if updated_args.amount <= company.available_credit do
      case Transactions.create_transaction(updated_args) do
        {:ok, transaction} ->
          case Companies.update_company(company, %{available_credit: company.available_credit - transaction.amount}) do
            {:ok, _} -> {:ok, amount_to_float(transaction)}
            error -> {:error, "could not update companies available credit #{inspect(error)}"}
          end
        error -> {:error, "could not create transaction: #{inspect(error)}"}
      end
    else
      {:error, "Company does not have that amount in available credit. Amount available: #{company.available_credit}"}
    end
  end

  @doc """
  Updates a transaction for an id with args specified.
  """
  def update_transaction(_root, %{id: id} = args, _info) do
    transaction = Transactions.get_transaction!(id)
    company = Companies.get_company!(args.company_id)
    updated_args = amount_from_float(args)

    if updated_args.amount <= company.available_credit do
      case Transactions.update_transaction(transaction, updated_args) do
        {:ok, transaction} ->
          case Companies.update_company(company, %{available_credit: company.available_credit - transaction.amount}) do
            {:ok, _} -> {:ok, amount_to_float(transaction)}
            error -> {:error, "could not update companies available credit #{inspect(error)}"}
          end

        error -> {:error, "could not update transaction: #{inspect(error)}"}
      end
    else
      {:error, "Company does not have that amount in available credit. Amount available: #{company.available_credit}"}
    end
  end

  @doc """
  Deletes a transaction for an id
  """
  def delete_transaction(_root, %{id: id}, _info) do
    transaction = Transactions.get_transaction!(id)

    case Transactions.delete_transaction(transaction) do
      {:ok, transaction} ->
        {:ok, transaction}

      error ->
        {:error, "could not update transaction: #{inspect(error)}"}
    end
  end
end
