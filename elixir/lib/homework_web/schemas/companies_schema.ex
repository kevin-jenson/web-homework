defmodule HomeworkWeb.Schemas.CompaniesSchema do
	@moduledoc """
	Defines the graphql schema for company.
	"""
	use Absinthe.Schema.Notation

	alias HomeworkWeb.Resolvers.CompaniesResolver

	object :company do
		field(:id, non_null(:id))
		field(:name, :string)
		field(:credit_line, :float)
		field(:available_credit, :float)
	end

	object :company_mutations do
		@desc "Create a new company"
		field :create_company, :company do
			arg(:name, non_null(:string))
			arg(:credit_line, non_null(:float))

			resolve(&CompaniesResolver.create_company/3)
		end
	end
end