import { CircleCheck, X } from "lucide-react";


export default function NoticeModal({setShowModal}) {

  return(
    <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
              <div className="bg-white rounded-lg py-6 px-12 w-full max-w-md shadow-lg">
                <div className="flex flex-col items-center relative">
                  <div className="bg-green-200 border-2 border-green-500 p-2 rounded">
                    <CircleCheck className="text-green-500"/>
                  </div>
                  <h2 className="text-md text-gray-700 font-medium my-4">Successful!</h2>
                  <p className="text-gray-500 text-sm my-4 text-center">New Item has been added to the notice board successfully, all user will be notify by email</p>
                  <X className="text-red-400 absolute top-0 right-0 cursor-pointer"
                  onClick={() => setShowModal(false)}
                  />
                </div>
              </div>
            </div>
    </>
  )
}
