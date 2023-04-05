## Proof of Concept - Simplify Privacy Statements



Privacy is a complex policy area and is often used to shut down crucial user research or testing. Let's take the guess-work out of creating privacy and consent (P&C) notices for designers and researchers - maybe even for the entire government of Canada. Just as VAC has a logic to their benefits, so does a privacy and consent form. Let's create a tool that automatically generates P&C notices so that policy doesn't have to keep holding up the show.

_Mission Statement:_ Help CDS research and design spend more time with users, and less time fighting the bureaucracy.

_Goal:_ A working prototype that generates P&C statements.

Trello board: https://trello.com/b/vptWzBnE/generate-privacy-statements-portage

## Installing and running locally (Mac)

- Install `git`, `node` and `pandoc`. The best way to do this is probably using Homebrew (which you need to install first)
  - homebrew: `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
  - others: `brew install git node pandoc`
- You might want to set up ssh keys to make it easier to interact with GitHub. See [Generating a new SSH key and adding it to the ssh-agent](https://help.github.com/en/enterprise/2.16/user/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent). Alternatively, you could use [GitHub Desktop](https://desktop.github.com/) or an IDE with integrated git support.
- Clone the repo locally and go into the repo directory
  - `git clone git@github.com:cds-snc/simplify-privacy-statements-V2.git`
  - `cd simplify-privacy-statements-V2`
- If you want to use Google Analytics or to send feedback or link emails, you have to set up proper environment variables. Copy the `.env.example` file into `.env` and set the variables appropriately.
- Next install the third party modules using `npm install`
- You can now run the app locally! run `npm run dev` and then open a web browser to `localhost:3000`.

## April 2023 Update

