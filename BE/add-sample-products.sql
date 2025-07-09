-- Add sample products to database
INSERT INTO Products (Name, Description, Type, BasePrice, IsActive, CreatedAt, UpdatedAt)
VALUES 
('Classic Cotton T-Shirt', 'Comfortable cotton t-shirt perfect for custom designs', 'TShirt', 15.99, 1, GETDATE(), GETDATE()),
('Premium Cotton Tee', 'High-quality premium cotton t-shirt', 'TShirt', 19.99, 1, GETDATE(), GETDATE()),
('Vintage Style Shirt', 'Retro vintage style t-shirt', 'TShirt', 17.99, 1, GETDATE(), GETDATE());

-- Add sample mockups for the products
INSERT INTO Mockups (ProductId, Name, ImageUrl, IsDefault, MaxWidth, MaxHeight, SortOrder, CreatedAt, UpdatedAt)
VALUES 
(1, 'Front View', '/images/tshirt-front.png', 1, 300, 400, 1, GETDATE(), GETDATE()),
(1, 'Back View', '/images/tshirt-back.png', 0, 300, 400, 2, GETDATE(), GETDATE()),
(2, 'Front View', '/images/premium-tshirt-front.png', 1, 300, 400, 1, GETDATE(), GETDATE()),
(2, 'Back View', '/images/premium-tshirt-back.png', 0, 300, 400, 2, GETDATE(), GETDATE()),
(3, 'Front View', '/images/vintage-tshirt-front.png', 1, 300, 400, 1, GETDATE(), GETDATE()),
(3, 'Back View', '/images/vintage-tshirt-back.png', 0, 300, 400, 2, GETDATE(), GETDATE());
