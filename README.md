# CalGist

CalGist is a minimalist React app designed to simplify sharing `.ics` files stored on GitHub Gist. By constructing a URL with specific parameters, it can serve iCalendar events easily so users can add them directly from their mobile browsers, eliminating the need for email attachments.

## Usage

Construct a URL with the following query parameters:

- `title` (string): The title of the event.
- `gistid` (string): The GitHub Gist ID containing the `.ics` files.
- `filename` (string): The specific `.ics` file name within the Gist to fetch.
- `rev` (string, optional): Specific revision of the Gist.
- `button` (string, optional): Custom button text.
- `descr` (string, optional): Description text (`0` to hide).

**Example:**

`https://tmrk.github.io/calgist/?title=Meeting&gistid=YOUR_GIST_ID&filename=event1.ics&button=Add+Event&descr=Custom+description`

### **Parameter Logic:**

- **Button Text Logic:**
  - If `button` is defined, use its value.
  - Else, default to "Add to Calendar".

- **Description Logic:**
  - If `descr=0`, no description is displayed.
  - If `descr` is a string, display it.
  - If `descr` is undefined, use the description from the Gist API.

### **Accessing Multiple Files:**

If your Gist contains multiple `.ics` files, specify the desired file using the `filename` parameter.

**License**

MIT