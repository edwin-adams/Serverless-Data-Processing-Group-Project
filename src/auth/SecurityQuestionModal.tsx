import {
    Box,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text
} from "@chakra-ui/react";
import React, {useEffect, useRef} from "react";
import {checkSecurityQuestionDynamo} from "./service/CheckSecurityQuestionDynamo";
import {useNavigate} from "react-router-dom";

export const QuestionModal = ({isModalOpen, handleModalToggle, questions, loggedInUserId}) => {
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    useEffect(() => {
        if (isModalOpen) {
            inputRefs.current = Array.from({length: questions.length}, (_, index) => inputRefs.current[index] || null);
        }
    }, [isModalOpen, questions]);

    const navigate = useNavigate();

    function doLogin() {
        checkSecurityQuestionDynamo(loggedInUserId, inputRefs['current'][0].value, inputRefs['current'][1].value, inputRefs['current'][2].value).then((isSuccess) => {
            if (isSuccess) {
                navigate('/dashboard');
            } else {
                console.error("2 factor auth failed");
            }
        });
    }

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={handleModalToggle}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Security Questions</ModalHeader>
                    <ModalBody>
                        {questions.map((question: string, index: number) => (
                            <Box key={index} mb="6">
                                <Text fontSize="m" fontWeight="bold">
                                    {question}
                                </Text>
                                <Input
                                    type="text"
                                    variant="outline"
                                    size="md"
                                    ref={(el) => (inputRefs.current[index] = el)} // Set the ref based on the index
                                />
                            </Box>
                        ))}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={() => {
                            console.log(inputRefs);
                            doLogin();
                        }}>
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );

}
