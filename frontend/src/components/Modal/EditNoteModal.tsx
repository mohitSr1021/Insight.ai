import { useEffect } from 'react';
import { X, Link as LinkIcon } from 'lucide-react';
import { Modal, Input, Form, Tooltip } from 'antd';

const { TextArea } = Input;

const EditNoteModal = ({ isOpen, onClose, note, onSave }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (note && isOpen) {
            form.setFieldsValue({
                title: note.title,
                content: note.content,
                link: note.link || ''
            });
        }
    }, [note, isOpen, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onSave({ ...note, ...values });
            onClose();
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md ${isOpen ? 'visible' : 'invisible'}`}>
            <Modal
                className="custom-modal"
                title={
                    <div className="flex justify-between items-center px-2 py-4">
                        <span className="text-xl font-semibold text-gray-800">Edit Note</span>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 ease-in-out"
                        >
                            <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                        </button>
                    </div>
                }
                open={isOpen}
                onCancel={onClose}
                onOk={handleSubmit}
                okText="Save Changes"
                cancelText="Cancel"
                width={600}
                centered
                closeIcon={null}
            >
                <Form form={form} layout="vertical" className="space-y-4">
                    <Form.Item
                        name="title"
                        label={<span className="text-gray-700 font-medium">Title</span>}
                        rules={[{ required: true, message: 'Please enter a title' }]}
                    >
                        <Input placeholder="Enter note title" className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200" />
                    </Form.Item>
                    
                    <Form.Item
                        name="content"
                        label={<span className="text-gray-700 font-medium">Content</span>}
                        rules={[{ required: true, message: 'Please enter note content' }]}
                    >
                        <TextArea rows={6} placeholder="Enter note content" className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200" />
                    </Form.Item>
                    
                    <Form.Item
                        name="link"
                        label={
                            <div className="flex items-center gap-2">
                                <LinkIcon size={16} className="text-gray-500" />
                                <span className="text-gray-700 font-medium">Link (Optional)</span>
                            </div>
                        }
                        rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
                    >
                        <Input
                            placeholder="https://example.com"
                            className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                            suffix={
                                <Tooltip title="Add a related link to your note">
                                    <LinkIcon size={16} className="text-gray-400" />
                                </Tooltip>
                            }
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default EditNoteModal;
