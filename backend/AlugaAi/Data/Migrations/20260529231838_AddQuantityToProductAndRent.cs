using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AlugaAi.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddQuantityToProductAndRent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "rents",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "products",
                type: "INTEGER",
                nullable: false,
                defaultValue: 1);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "rents");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "products");
        }
    }
}
