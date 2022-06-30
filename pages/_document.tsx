import NextDocument, { Head, Html, Main, NextScript } from "next/document"

export default class Document extends NextDocument {
   render(): JSX.Element {
      return (
         <Html>
            <Head>
               <link href="https://fonts.googleapis.com" rel="preconnect" />
               <link href="https://fonts.gstatic.com" rel="preconnect" />
               <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                     rel="stylesheet"
               />
            </Head>
            <body>
               <Main/>
               <NextScript/>
            </body>
         </Html>
      )
   }
}