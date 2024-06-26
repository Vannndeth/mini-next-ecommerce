"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import style from "@/app/(admin)/products/style.module.css"
import { useState } from "react";
import { BASE_URL, ACCESS_TOKEN } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { ProductType } from "@/lib/definitions";
import { Image } from "@nextui-org/react";

const FILE_SIZE = 1024 * 1024 * 2; // 2MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

const validationSchema = Yup.object().shape({
	category: Yup.object().shape({
        name: Yup.string().required('Required'),
    }),
	name: Yup.string().required("Required"),
	desc: Yup.string().nullable(),
	price: Yup.number().required("Required"),
	quantity: Yup.number().required("Required"),
	fileIcon: Yup.mixed()
		.test("fileFormat", "Unsupported Format", (value: any) => {
			if (!value) {
				return true;
			}
			return SUPPORTED_FORMATS.includes(value.type);
		})
		.test("fileSize", "File Size is too large", (value: any) => {
			if (!value) {
				true;
			}
			return value.size <= FILE_SIZE;
		})

		.required("Required"),
	fileProduct: Yup.mixed()
		.test("fileFormat", "Unsupported Format", (value: any) => {
			if (!value) {
				return true;
			}
			return SUPPORTED_FORMATS.includes(value.type);
		})
		.test("fileSize", "File Size is too large", (value: any) => {
			if (!value) {
				true;
			}
			return value.size <= FILE_SIZE;
		})

		.required("Required"),
});


export function EditProductComponent({category, name, price, image, quantity, desc, seller, id}: ProductType) {
	
	const router = useRouter();
	
	const initialValues: ProductType = {
		id: id || 0,
		seller: seller || "",
		category:{name:category},
		name: name || "",
		desc: desc || "",
		image: image || "",
		price: price || 0,
		quantity: quantity || 0,
	};
	

const handleSubmitProudct = async (props: ProductType) => {
	console.log("product uploade: ", props.id)
	const res = await fetch(`${BASE_URL}/api/products/${props.id}/`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${ACCESS_TOKEN}`,
		},
		body: JSON.stringify(props),
	});
	const data = await res.json()
	console.log("product uploade: ", data)
};
  
	return (
		<main className={`${style.container}`}>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={handleSubmitProudct}
			>
				{({ setFieldValue }) => (
					<Form className="p-4 rounded-lg w-full flex justify-evenly">
						{/* Product Name */}
                        <div className="w-96">
                        <h1 className={`${style.title}`}>Update Product</h1>
						<div className="mb-5">
							<label className={`${style.label}`} htmlFor="name">
								Product Name
							</label>
							<Field
								type="text"
								name="name"
								id="name"
								className={`${style.input}`}
                               placeholder={name}
							/>
							<ErrorMessage
								name="name"
								component="div"
								className={`${style.error}`}
							/>
						</div>

						{/* Product Description */}
						<div className="mb-5">
							<label className={`${style.label}`} htmlFor="desc">
								Product Description
							</label>
							<Field
								type="text"
								name="desc"
								id="desc"
								component="textarea"
								className={`${style.input}`}
                                  placeholder={desc}
							/>
							<ErrorMessage
								name="desc"
								component="div"
								className={`${style.error}`}
							/>
						</div>

						{/* Product Price */}
						<div className="mb-5">
							<label className={`${style.label}`} htmlFor="price">
								Product Price
							</label>
							<Field
								type="number"
								name="price"
								id="price"
								className={`${style.input}`}
                               placeholder={price}
							/>
							<ErrorMessage
								name="price"
								component="div"
								className={`${style.error}`}
           
							/>
						</div>

						{/* Product Quantity */}
						<div className="mb-5">
							<label className={`${style.label}`} htmlFor="price">
								Product Quantity
							</label>
							<Field
								type="number"
								name="quantity"
								id="quantity"
								className={`${style.input}`}
                
							/>
							<ErrorMessage
								name="quantity"
								component="div"
								className={`${style.error}`}
							/>
						</div>

						{/* Product Category */}
						<div className="mb-5">
							<label className={`${style.label}`} htmlFor="categoryName">
								Product Category
							</label>
							<Field
								type="text"
								name="categoryName"
								id="categoryName"
								className={`${style.input}`}
                                
							/>
							<ErrorMessage
								name="categoryName"
								component="div"
								className={`${style.error}`}
							/>
						</div>
                        </div>
						{/* Product Category Icon*/}
                        <div>
						<div className="mb-5 mt-10 mx-20 w-[300px] ">
							<label className={`${style.label}`} htmlFor="categoryIcon">
								Product Category Icon
							</label>
							<Field
								type="file"
								name="fileIcon"
								id="fileIcon"
								component={CustomInput}
								setFieldValue={setFieldValue}
								className={`${style.input}`}
							/>
							<ErrorMessage
								name="fileIcon"
								component="div"
								className={`${style.error}`}
							/>
						</div>

						{/* Product Image*/}
						<div className="mb-5 mx-20 w-[300px] ">
							<label className={`${style.label}`} htmlFor="fileProduct">
								Product Image
							</label>
							<Field
								type="file"
								name="fileProduct"
								id="fileProduct"
								component={CustomInput}
								setFieldValue={setFieldValue}
								className={`${style.input}`}

							/>
							<ErrorMessage
								name="fileProduct"
								component="div"
								className={`${style.error}`}
							/>
						</div>

						{/* button submit */}
						<button onClick={()=>router.push(`/dashboard`)}  type="submit" className='bg-blue-600 text-white px-3 py-2 ml-2 rounded-lg mx-36 relative left-[70px]' >
							Update
						</button>
						
						<button onClick={()=>router.push(`/dashboard`)} type="submit" className='bg-red-600 text-white px-3 py-2 ml-2 rounded-lg ' >
							Cancel
						</button>
                        </div>
					</Form>
				)}
			</Formik>
		</main>
	);
}
const CustomInput = ({ field, form, setFieldValue }: any) => {
	const [imagePreview, setImagePreview] = useState("");

	const handleUploadeFile = (e: any) => {
		const file = e.target.files[0];
		const localUrl = URL.createObjectURL(file);
		console.log(localUrl);
		setImagePreview(localUrl);

		setFieldValue(field.name, file);
	};
	return (
		<div>
			<input onChange={(e) => handleUploadeFile(e)} type="file" />
			{imagePreview && <Image src={imagePreview} alt="preview" />}
		</div>
	);
  }