# Polyhedra-ZKBridge Mint and Bridge

This project is a TypeScript-based application that utilizes Node.js and npm. It includes a configuration file `SAMPLE-CONFIG.ts` that sets up various parameters for the application.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of [Node.js and npm](https://nodejs.org/en/download/).
- You have a basic understanding of TypeScript and Node.js.

## Installing Polyhedra

To install Polyhedra, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Run the following command to install the project dependencies:

```bash
npm install
```

## Configuring Polyhedra

To configure the application, you need to RENAME SAMPLE-CONFIG.ts to config.ts, modify the file and CREATE a proxies.txt file:

1. Replace "PATH TO YOUR WALLET FILE" with the actual path to your wallet file.
2. Make sure you have the WALLETS environment variable set in your environment. This should be a JSON string representing an array of wallet objects. Each object should have a name and privateKey property. For example, inside the wallets.env file: WALLETS=[{"name" : "1", "privateKey" : "key"}]. The application will throw an error if it's missing.
3. Adjust the MIN_WALLET_WAIT_TIME, MAX_WALLET_WAIT_TIME, MIN_SWAP_WAIT_TIME, and MAX_SWAP_WAIT_TIME as per your requirements. These values are in seconds.
4. Update the EXCLUDED_WALLETS array if there are any wallets you want to exclude.
5. The MODULES object contains various configurations for different modules. Adjust these as needed.
6. Create a proxies.txt file in the root directory of the project. This file should contain a list of proxies, each on a new line, in the following format: name:ip:port:username:pw

## Running Polyhedra
To run Polyhedra, execute the following command:

```bash
npm run polyhedra
```

## Disclaimer
This script is provided "as is" and any expressed or implied warranties, including, but not limited to, the implied warranties of merchantability and fitness for a particular purpose are disclaimed. In no event shall the author or contributors be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, procurement of substitute goods or services; loss of use, data, or profits; or business interruption) however caused and on any theory of liability, whether in contract, strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this software, even if advised of the possibility of such damage. The user assumes all responsibility for the use of this software and runs it at their own risk.