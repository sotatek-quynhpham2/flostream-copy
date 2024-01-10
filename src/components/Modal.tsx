import { HTMLAttributes } from "react"
import { Button } from "@/components/Button";
export const Modal = ({ className, children, handleClose, handleNext, ariaLabel, ariaLabelFooter, disableValue, showClose }: ModalContentProps) => {

    return (
        <div className={`relative z-10 ${className}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">

            <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"></div>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                    <div className="relative transform overflow-hidden rounded-[20px] bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[445px]">
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="">
                                {showClose && (<div onClick={handleClose} className="absolute right-2 top-0 mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center sm:mx-0 sm:h-10 sm:w-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M1 1L6 6M11 11L6 6M6 6L11 1L1 11" stroke="#1F3832" stroke-width="2" />
                                    </svg>
                                </div>)}
                                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                    <h3 className="text-base text-[28px] font-semibold leading-[42px] text-gray-900 text-center" id="modal-title">{ariaLabel}</h3>
                                    {children}
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 pt-3 pb-6 sm:flex sm:flex-row-reverse sm:px-6">
                            <Button
                                onClick={handleNext}
                                className="font-bold py-1 px-2 rounded text-white"
                                disabled={disableValue}
                            >
                                {ariaLabelFooter}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

type ModalContentProps = HTMLAttributes<HTMLDivElement> & {
    handleClose?: () => void
    handleNext?: () => void
    ariaLabel?: string
    ariaLabelFooter?: string
    disableValue?: boolean
    showClose?: boolean
}
