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
import { createPerformanceEvaluation } from 'apiSdk/performance-evaluations';
import { Error } from 'components/error';
import { performanceEvaluationValidationSchema } from 'validationSchema/performance-evaluations';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { EmployeeInterface } from 'interfaces/employee';
import { getEmployees } from 'apiSdk/employees';
import { PerformanceEvaluationInterface } from 'interfaces/performance-evaluation';

function PerformanceEvaluationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PerformanceEvaluationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPerformanceEvaluation(values);
      resetForm();
      router.push('/performance-evaluations');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PerformanceEvaluationInterface>({
    initialValues: {
      evaluation: '',
      employee_id: (router.query.employee_id as string) ?? null,
    },
    validationSchema: performanceEvaluationValidationSchema,
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
            Create Performance Evaluation
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="evaluation" mb="4" isInvalid={!!formik.errors?.evaluation}>
            <FormLabel>Evaluation</FormLabel>
            <Input type="text" name="evaluation" value={formik.values?.evaluation} onChange={formik.handleChange} />
            {formik.errors.evaluation && <FormErrorMessage>{formik.errors?.evaluation}</FormErrorMessage>}
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
    entity: 'performance_evaluation',
    operation: AccessOperationEnum.CREATE,
  }),
)(PerformanceEvaluationCreatePage);
