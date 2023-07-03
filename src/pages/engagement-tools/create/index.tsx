import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createEngagementTool } from 'apiSdk/engagement-tools';
import { Error } from 'components/error';
import { engagementToolValidationSchema } from 'validationSchema/engagement-tools';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { EmployeeInterface } from 'interfaces/employee';
import { getEmployees } from 'apiSdk/employees';
import { EngagementToolInterface } from 'interfaces/engagement-tool';

function EngagementToolCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: EngagementToolInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createEngagementTool(values);
      resetForm();
      router.push('/engagement-tools');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<EngagementToolInterface>({
    initialValues: {
      tool_name: '',
      employee_id: (router.query.employee_id as string) ?? null,
    },
    validationSchema: engagementToolValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Engagement Tool
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="tool_name" mb="4" isInvalid={!!formik.errors?.tool_name}>
            <FormLabel>Tool Name</FormLabel>
            <Input type="text" name="tool_name" value={formik.values?.tool_name} onChange={formik.handleChange} />
            {formik.errors.tool_name && <FormErrorMessage>{formik.errors?.tool_name}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<EmployeeInterface>
            formik={formik}
            name={'employee_id'}
            label={'Select Employee'}
            placeholder={'Select Employee'}
            fetcher={getEmployees}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.first_name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'engagement_tool',
    operation: AccessOperationEnum.CREATE,
  }),
)(EngagementToolCreatePage);
