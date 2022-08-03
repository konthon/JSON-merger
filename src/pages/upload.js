import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  Heading,
  Stack,
  StackDivider,
  Textarea,
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react";
import { isArray, isEmpty, isEqual, mergeWith } from "lodash";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

const UploadPage = () => {
  const [output, setOutput] = useState({});
  const { onCopy, hasCopied } = useClipboard(JSON.stringify(output));
  const {
    isOpen: isOpenClear,
    onOpen: onOpenClear,
    onClose: onCloseClear,
  } = useDisclosure();
  const { register, handleSubmit, control } = useForm({
    defaultValues: { data: [{ input: "" }] },
  });
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "data",
  });
  const onSubmit = (data) => {
    if (data.data && isArray(data.data) && data.data.length > 0) {
      setOutput({});
      let result = {};
      for (const item of data.data) {
        result = mergeWith(result, JSON.parse(item.input), (dest, src) => {
          if (isArray(dest) && isArray(src)) {
            return [
              ...src,
              ...dest.filter((d) => src.every((s) => !isEqual(d, s))),
            ];
          }
        });
      }
      console.log(result);
      setOutput(result);
    }
  };
  return (
    <>
      <Container maxWidth="container.lg">
        <Heading as="h1" mb={3}>
          JSON Merger
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            sx={{
              "& > .field:nth-of-type(2n)": {
                backgroundColor: "gray.100",
              },
            }}
          >
            {fields.map((field, index) => (
              <Flex key={field.id} gap={2} p={2} className="field">
                <Box>{index + 1}</Box>
                <FormControl>
                  <Textarea
                    size="sm"
                    backgroundColor="white"
                    placeholder="วาง JSON ตรงนี้"
                    fontFamily="mono"
                    {...register(`data.${index}.input`)}
                  />
                </FormControl>
                <Button colorScheme="red" onClick={() => remove(index)}>
                  ลบชุดที่ {index + 1}
                </Button>
              </Flex>
            ))}
            <Flex gap={2} justifyContent="flex-end">
              <Button onClick={onOpenClear}>ล้างทั้งหมด</Button>
              <Button colorScheme="blue" onClick={() => append({ input: "" })}>
                เพิ่ม
              </Button>
            </Flex>
            <StackDivider />
            <Button colorScheme="green" type="submit">
              รวมเลย
            </Button>
          </Stack>
        </form>
        {!isEmpty(output) && (
          <Box my={4}>
            <Heading>ผลลัพธ์</Heading>
            <Textarea
              defaultValue={JSON.stringify(output, undefined, 2)}
              fontFamily="mono"
              size="sm"
            />
            <Button onClick={onCopy} mt={2}>
              {hasCopied ? "คัดลอกแล้ว" : "คัดลอกผลลัพธ์"}
            </Button>
          </Box>
        )}
      </Container>
      <AlertDialog isOpen={isOpenClear} onClose={onCloseClear}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>ล้างข้อมูล</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>ยืนยันการล้าง</AlertDialogBody>
          <AlertDialogFooter gap={2}>
            <Button onClick={onCloseClear}>ยกเลิก</Button>
            <Button
              colorScheme="red"
              onClick={() => {
                replace([{ input: "" }]);
                onCloseClear();
              }}
            >
              ยืนยัน
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UploadPage;
