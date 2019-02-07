# Electron 4 Printing Bug

This application demonstrates an issue printing large documents on Windows. This bug affects at least the Microsoft Print-to-PDF, XPS Document Writer, and OneNote printer drivers. It is unknown whether the same bug affects physical printers, as the printed page count would be prohibitive.

The issue was first noticed while working with the current ECMAScript PDF (805 pages) in a PDF.js-based viewer on Electron. PDF.js itself was quickly eliminated as the problem, as failures occur post-rendering. This application does, however, follow similar printing methodology to PDF.js to ensure reasonable parity of results.

It appears that the primary cause of problems is memory usage, which grows with each additional page. This behavior is not seen in versions of Electron prior to 4.

## Running the demonstration

```
npm install    # first time setup
npm start
```

Choose the number of pages to print in the input box (multiples of 100, 800 by default), and click **Print**. The progress bar indicates rendering progress, not printing progress. Once rendering is complete, the print dialog will appear. Choose the Microsoft Print to PDF printer driver, followed by a suitable filename.

On Windows it is useful to monitor progress from this point onwards in the print spooling dialog (which should appear in the system tray).

Since the printing issues appear to be memory-related, having Task Manager or Resource Monitor open is also recommended.

Once (if) the document is printed, the resulting PDF should consist of the appropriate number of pages, each with its page number printed on the center of the page. (Although this results in more compact files than when, for example, printing the ECMAScript PDF, this does not appear to affect the odds of encountering a printing failure.)

## Issues encountered

Typically in my environment, in a Windows 10 VM with 6GB of memory, problems will occur in the mid-700 page count range. 700 page print runs will typically succeed, although I have seen one failure (out of memory). 800 page print runs will consistently fail.

Issues encountered include:

* Printing will silently fail, leaving a zero-sized document.
* The final pages of the document will be blank.
* The process will run out of memory, issuing a detail-free trace, as below.

```
<--- Last few GCs --->


<--- JS stacktrace --->


#
# Fatal process OOM in insufficient memory to create an Isolate
#
```

Allocating more memory to the VM does result in print runs succeeding more often. At 8GB, 800 page print runs are reasonably stable.

A colleague has tested on a physical machine with 16GB of RAM, to confirm the issue (at correspondingly larger page counts).

## Printer drivers tested

* Microsoft Print to PDF
* Microsoft XPS Document Writer
* OneNote

The last of these, OneNote, actually supports significantly larger documents (~2.5x), likely due to on-the-fly compression.

## Other Electron versions tested

* Electron 2.0.17 - successfully printed 800 and 2400 page documents.
* Electron 3.1.3 - successfully printed 800 and 2400 page documents.
* Electron 5.0.0-beta.2 - exhibits the same problems as Electron 4.