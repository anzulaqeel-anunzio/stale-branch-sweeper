# Stale Branch Sweeper

Clean up your repository by automatically identifying and deleting old, unused branches. This GitHub Action helps maintain hygiene in repositories with many contributors.

## Features

-   **Staleness Check**: Deletes branches inactive for X days.
-   **Protection**: Allows exempting specific branches (e.g., `main`, `dev`).
-   **Dry Run Mode**: Test without actually deleting anything.
-   **Detailed Logs**: Lists which branches were checked and deleted.

## Usage

Create a workflow file (e.g., `.github/workflows/cleanup-branches.yml`):

```yaml
name: Cleanup Branches
on:
  schedule:
    - cron: '0 0 * * 0' # Run weekly

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Stale Branch Sweeper
        uses: ./
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          days_old: '30'
          dry_run: 'true'
          ignore_branches: 'main,master,dev,staging'
```

## Inputs

| Input | Description | Default |
| :--- | :--- | :--- |
| `token` | GITHUB_TOKEN | `${{ github.token }}` |
| `days_old` | Number of days of inactivity | `30` |
| `dry_run` | If true, only logs actions | `true` |
| `ignore_branches` | Comma-separated list of branches to keep | `main,master` |

## Contact

Developed for Anunzio International by Anzul Aqeel.
Contact +971545822608 or +971585515742.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---
### 🔗 Part of the "Ultimate Utility Toolkit"
This tool is part of the **[Anunzio International Utility Toolkit](https://github.com/anzulaqeel-anunzio/ultimate-utility-toolkit)**.
Check out the full collection of **180+ developer tools, scripts, and templates** in the master repository.

Developed for Anunzio International by Anzul Aqeel.
