import chatBubbles from "../../assets/chatBubbles.png";

const StartConversation = () => {

  return(
    <>
              <div className="flex justify-center items-center h-full">
                <div className="flex flex-col items-center">
                  <img src={chatBubbles} alt="start conversation Image" className="mb-7 w-40  h-32" />
                  <p className="font-medium text-lg">Start a conversation</p>
                </div>
              </div>
    </>
  )
}

export default StartConversation;