-- CreateTable
CREATE TABLE `Loan` (
    `_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `book_id` VARCHAR(191) NOT NULL,
    `loan_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `return_date` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_user_id`(`user_id`),
    INDEX `idx_book_id`(`book_id`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `Loan_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `Loan_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `Book`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
