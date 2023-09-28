import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { useState } from "react";

import Button from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useCheckoutForm from "@/hooks/use-checkout-form-modal";
import axios from "axios";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(1),
  postalCode: z.string().min(5),
  province: z.string().min(1),
  city: z.string().min(1),
  district: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(1)
})


const CheckoutFormModal = () => {
  const checkoutFormModal = useCheckoutForm();
  const productIds = useCheckoutForm((state) => state.productIds)
  const totalPrice = useCheckoutForm((state) => state.totalPrice)

  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      postalCode: "",
      province: "",
      city: "",
      district: "",
      address: "",
      phone: ""
    }
  })

  const onPostalCodeChange = async (value: string) => {
    try {
      if (value.length === 5) {
        const res = await axios.get(`https://kodepos.vercel.app/search/?q=${value}`);
        console.log(res.data.data[0]);
        if (res.data.data[0]) {
          form.setValue("province", res.data.data[0].province)
          form.setValue("city", res.data.data[0].city)
          form.setValue("district", res.data.data[0].district)
        } else {
          form.setValue("province", "")
          form.setValue("city", "")
          form.setValue("district", "")
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        productIds,
        totalPrice,
        ...values
      });
      window.location = res.data.url;
    } catch (error) {
      toast.error("Something went wrong..");
    } finally {
      setLoading(false);
    }
  }

  const onChange = (open: boolean) => {
    if (!open) {
      checkoutFormModal.onClose();
    }
  };

  return (
    <Dialog open={checkoutFormModal.isOpen} onOpenChange={onChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customer Data</DialogTitle>
          <DialogDescription>
            Make sure the data you input is correct.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input disabled={loading} placeholder="Fulan" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="62222"
                            {...field}
                            onChange={(e) => {
                              onPostalCodeChange(e.target.value);
                              field.onChange(e)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                          <Input disabled={true} placeholder="Jawa Timur" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input disabled={true} placeholder="Surabaya" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>
                        <FormControl>
                          <Input disabled placeholder="Keputih" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input disabled={loading} placeholder="Jalan in aja dulu Surabaya Jawa Timur" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input disabled={loading} placeholder="08123456789" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="pt-6 space-x-2 flex items-center justify-end">
                  <Button disabled={loading} onClick={() => onChange}>Cancel</Button>
                  <Button disabled={loading} type="submit">Save</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CheckoutFormModal;