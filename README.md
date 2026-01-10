# Telegram Google Sheet Deal Poster Bot

This is a simple yet powerful Telegram bot that automatically fetches deals from a Google Sheet and posts them to a specified Telegram channel at regular intervals.

## Features

-   **Automated Posting:** Runs on a schedule (e.g., every 30 minutes) to check for and post new deals.
-   **Google Sheets Integration:** Reads deal information directly from a Google Sheet.
-   **Status Tracking:** Ensures deals are not posted more than once by marking them as "posted" in the sheet.
-   **Rich Messages:** Posts messages with images, formatted text (Markdown), and links.
-   **Admin Notifications:** Sends status updates, confirmations, and error alerts to a private admin chat.
-   **Remote Control:** Can be started and stopped via commands (`/start`, `/stop`) sent from the admin's chat.
-   **Robust & Stable:** Designed with error handling and a safe scheduling mechanism to run reliably.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or higher recommended)
-   A Telegram Bot Token. You can get one from the [BotFather](https://t.me/botfather).
-   A Google Cloud Platform project with the Google Sheets API enabled.
-   A Google Service Account and its JSON credentials file.

## Setup & Configuration

1.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd telegram_bot
    ```
    *Or simply download the project files.*

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Google Sheets API Setup:**
    -   Go to your [Google Cloud Console](https://console.cloud.google.com/).
    -   Create a new project (or use an existing one).
    -   Enable the **Google Sheets API** for your project.
    -   Create a **Service Account**. Go to "Credentials" > "Create Credentials" > "Service Account".
    -   Download the JSON key file for the service account. Rename it to `credentials.json` and place it in the project directory.
    -   Open your Google Sheet and share it with the `client_email` found in your `credentials.json` file, giving it "Editor" permissions.

4.  **Create `.env` file:**
    Create a file named `.env` in the root of the project and add the following variables:

    ```env
    # Your Telegram bot token from BotFather
    BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN

    # The ID of the channel where deals will be posted (e.g., @yourchannel or -100123456789)
    CHANNEL_ID=YOUR_TELEGRAM_CHANNEL_ID

    # Your personal Telegram Chat ID for receiving status notifications
    chat_Id=YOUR_PERSONAL_CHAT_ID

    # The name of the Google Service Account JSON file
    CREDS_FILE=credentials.json

    # The ID of your Google Sheet (from the URL)
    SPREADSHEET_ID=YOUR_GOOGLE_SHEET_ID
    ```

5.  **Prepare your Google Sheet:**
    Make sure your sheet has the following columns (the names must match exactly):
    `title`, `price`, `old_price`, `discount`, `link`, `image_url`, `posted`

    -   The `posted` column should contain `no` for new deals you want to post. The bot will automatically change it to `yes` after posting.

## Running the Bot

Once everything is configured, you can start the bot with:

```bash
node index.js
```

The bot will start, send a confirmation message to your admin chat, and begin checking for deals.

## Bot Commands

You can control the bot by sending these commands from your personal Telegram chat (the one matching `chat_Id`):

-   `/start`: Starts the automatic posting schedule.
-   `/stop`: Stops the automatic posting schedule.
