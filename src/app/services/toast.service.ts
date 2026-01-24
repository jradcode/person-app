import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  message = signal<string | null>(null);
  type = signal<'success' | 'error'>('success');
  
  // A "computed" signal that updates whenever 'type' changes
  colorClass = computed(() => 
    this.type() === 'success' ? 'bg-green-500' : 'bg-red-500'
  );

  private timeoutId?: any;

  show(msg: string, type: 'success' | 'error' = 'success') {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.message.set(msg);
    this.type.set(type);
    
    this.timeoutId = setTimeout(() => {
      this.message.set(null);
    }, 3000);
  }
}