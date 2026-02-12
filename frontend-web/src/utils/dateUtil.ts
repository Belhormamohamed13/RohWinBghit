import { format, addDays, isSameDay, isTomorrow, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

class DateUtil {
  static format(date: Date | string, formatStr: string = 'dd/MM/yyyy'): string {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, formatStr, { locale: fr })
  }

  static formatDateTime(date: Date | string): string {
    return this.format(date, 'dd/MM/yyyy HH:mm')
  }

  static formatTime(date: Date | string): string {
    return this.format(date, 'HH:mm')
  }

  static fromNow(date: Date | string): string {
    const d = typeof date === 'string' ? parseISO(date) : date
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - d.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'À l\'instant'
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)} h`
    return `Il y a ${Math.floor(diffInMinutes / 1440)} j`
  }

  static formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours === 0) return `${mins} min`
    if (mins === 0) return `${hours} h`
    return `${hours}h ${mins}m`
  }

  static isToday(date: Date | string): boolean {
    const d = typeof date === 'string' ? parseISO(date) : date
    return isSameDay(d, new Date())
  }

  static isTomorrow(date: Date | string): boolean {
    const d = typeof date === 'string' ? parseISO(date) : date
    return isTomorrow(d)
  }

  static addDays(date: Date | string, days: number): Date {
    const d = typeof date === 'string' ? parseISO(date) : date
    return addDays(d, days)
  }

  static getAvailableTripDates(): Array<{ value: string; label: string; dayName: string; date: string }> {
    const dates = []
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i)
      const value = format(date, 'yyyy-MM-dd')
      const label = i === 0 ? 'Aujourd\'hui' : 
                   i === 1 ? 'Demain' : 
                   format(date, 'EEEE d MMMM', { locale: fr })
      const dayName = format(date, 'EEEE', { locale: fr })
      const dateStr = format(date, 'd MMMM', { locale: fr })
      
      dates.push({ value, label, dayName, date: dateStr })
    }
    
    return dates
  }

  static getTripDateDisplay(date: Date | string): string {
    if (this.isToday(date)) return 'Aujourd\'hui'
    if (this.isTomorrow(date)) return 'Demain'
    return this.format(date, 'EEEE d MMMM')
  }
}

export default DateUtil
