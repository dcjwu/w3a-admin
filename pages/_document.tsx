import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from "next/document"

export default class MyDocument extends Document {
   static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
      const initialProps = await Document.getInitialProps(ctx)
      return { ...initialProps }
   }

   render(): JSX.Element {
      return (
         <Html>
            <Head>
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