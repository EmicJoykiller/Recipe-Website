export default function Contact() {
    return (
        <html>
          <head>
            <link rel="stylesheet" type="text/css" href="css/contact.css" />
            <title>Contact Us</title>
          </head>
          <body>
            <h1>Contact Us</h1>
            <p>If you have any questions or comments, please fill out the form below and we will get back to you as soon as possible.</p>
            <form action="/contact" method="post">
              <label htmlFor="name">Name:</label><br />
              <input type="text" id="name" name="name" required /><br />
              <label htmlFor="email">Email:</label><br />
              <input type="email" id="email" name="email" required /><br />
              <label htmlFor="message">Message:</label><br />
              <textarea id="message" name="message" rows="4" cols="50" required></textarea><br />
              <button type="submit">Send Message</button>
            </form>
          </body>
        </html>
    );
  }