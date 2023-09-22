import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { useState } from "react";

import Button from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useCheckoutForm from "@/hooks/use-checkout-form-modal";
import axios from "axios";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(1),
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
      address: "",
      phone: ""
    }
  })
  
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