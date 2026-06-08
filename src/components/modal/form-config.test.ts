import { describe, it, expect } from 'vitest';
import { formSchema } from './form-config';
import { COUNTRIES_LIST } from '../../store/countries-slice';

const schema = formSchema(COUNTRIES_LIST);

const validData = {
  name: 'John',
  age: 25,
  email: 'john@example.com',
  country: 'Poland',
  password: 'Pass1!abc',
  password_confirm: 'Pass1!abc',
  gender: 'male',
  terms: true,
  image: new File(['img'], 'test.png', { type: 'image/png' }),
};

describe('formSchema', () => {
  it('passes with valid data', async () => {
    await expect(schema.validate(validData)).resolves.toBeTruthy();
  });

  it('fails when name is empty', async () => {
    await expect(schema.validate({ ...validData, name: '' })).rejects.toThrow(
      'Name is required'
    );
  });

  it('fails when name starts with lowercase', async () => {
    await expect(
      schema.validate({ ...validData, name: 'john' })
    ).rejects.toThrow('First letter must be uppercase');
  });

  it('fails with invalid email (no @)', async () => {
    await expect(
      schema.validate({ ...validData, email: 'notemail' })
    ).rejects.toThrow('Email isnt valid');
  });

  it('fails with invalid email (empty)', async () => {
    await expect(schema.validate({ ...validData, email: '' })).rejects.toThrow(
      'Email is required'
    );
  });

  it('fails with weak password (no special char)', async () => {
    await expect(
      schema.validate({
        ...validData,
        password: 'Simple1',
        password_confirm: 'Simple1',
      })
    ).rejects.toThrow('Password isnt valid');
  });

  it('fails when passwords do not match', async () => {
    await expect(
      schema.validate({ ...validData, password_confirm: 'Different1!' })
    ).rejects.toThrow('Passwords must match');
  });

  it('fails with country not in list', async () => {
    await expect(
      schema.validate({ ...validData, country: 'Mars' })
    ).rejects.toThrow('Country does not exist');
  });

  it('fails with country empty', async () => {
    await expect(
      schema.validate({ ...validData, country: '' })
    ).rejects.toThrow('Country is required');
  });

  it('fails with image larger than 2MB', async () => {
    const bigFile = new File([new ArrayBuffer(3 * 1024 * 1024)], 'big.png', {
      type: 'image/png',
    });
    await expect(
      schema.validate({ ...validData, image: bigFile })
    ).rejects.toThrow('Max image size is 2MB');
  });

  it('fails with wrong image type', async () => {
    const wrongFile = new File(['txt'], 'file.txt', { type: 'text/plain' });
    await expect(
      schema.validate({ ...validData, image: wrongFile })
    ).rejects.toThrow('Only PNG and JPEG are allowed');
  });
});
