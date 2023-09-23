import Moralis from 'moralis';

async function fetchTransaction()
{
    try {
        await Moralis.start({
          apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjQxM2Q2NWE4LTllZTItNDM2Yi1iNWIxLTg3YmRlNTEyYWQ3NiIsIm9yZ0lkIjoiODgyODkiLCJ1c2VySWQiOiI4NzkzMSIsInR5cGVJZCI6IjQzNDNlNDAxLTA3MTctNDlkYy04MmIyLTE3YzdhZjYxZTAwNCIsInR5cGUiOiJQUk9KRUNUIiwiaWF0IjoxNjk1NDM3MjMyLCJleHAiOjQ4NTExOTcyMzJ9.RxXLhgOLq-CBAiIJYaY44BJPdKoS3-smZ0N3-dXNbf0"
        });
      
        const response = await Moralis.EvmApi.transaction.getTransactionVerbose({
          "chain": "0x5",
          "transactionHash": "0xb803a4eaf1efba5da39b204514022f02e003fc9b2a87d23a2e1461eaeb891f83"
        });
      
        console.log( JSON.stringify(response.raw, null, 2)  );
      } catch (e) {
        console.error(e);
      }
}

fetchTransaction()