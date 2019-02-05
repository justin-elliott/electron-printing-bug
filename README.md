# Electron 4 Printing Bug

This application demonstrates an issue printing large documents on Windows via Microsoft Print-to-PDF. It is unknown whether the same bug affects printing in general, as the printed page count would be prohibitive.

The issue was first noticed while working with the current ECMAScript PDF (805 pages) in a PDF.js-based viewer on Electron. PDF.js itself was quickly eliminated as the problem, as failures occur post-rendering. This application does, however, follow similar printing methodology to PDF.js to ensure reasonable parity of results.

## Running the demonstration

```
npm install    # first time setup
npm start
```

Choose the number of pages to print in the input box (800 by default), and click **Print**. The progress bar indicates rendering progress, not printing progress. Once rendering is complete, the print dialog will appear. Choose the Microsoft Print to PDF printer driver, followed by a suitable filename.

On Windows it is useful to monitor progress from this point onwards in the print spooling dialog (which should appear in the system tray).

Once (if) the document is printed, the resulting PDF should consist of the appropriate number of pages, each with its page number printed on the center of the page. (Although this results in more compact files than when, for example, printing the ECMAScript PDF, this does not appear to affect the odds of encountering a printing failure.)

## Problems encountered

* Printing will sometimes silently fail, leaving a zero-sized document.
* The final pages of the document will be blank.
* The application will crash.

(Typically in my environment, these problems will occur in the mid-700 page count range.)